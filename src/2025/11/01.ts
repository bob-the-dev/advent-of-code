import { readFileSync } from "fs";

import { Memo } from "../../../utils/memoize";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  const devices = input.map((l) => {
    const splitted = l.split(": ");
    const index = splitted[0];
    const connections = splitted[1].split(" ").map((c) => c.trim());
    const isExit = connections.includes("out");
    return {
      index,
      connections,
      isExit,
    };
  });

  const memo = new Memo("exitscheck");

  const checkExitLeadsToYou: (index: string) => number = memo.memoize(
    (index: string) => {
      if (index === "you") {
        return 1;
      }
      const targets = devices.filter((d) => d.connections.includes(index));

      if (targets.length) {
        return targets
          .map((t) => checkExitLeadsToYou(t.index))
          .reduce((acc, cur) => (acc += cur), 0);
      }
      return 0;
    }
  );

  return devices
    .filter((d) => d.isExit)
    .map((d) => {
      const goesToYou = checkExitLeadsToYou(d.index);
      console.log(d, goesToYou);
      return goesToYou;
    })
    .reduce((acc, cur) => {
      return (acc += cur);
    }, 0);
};
