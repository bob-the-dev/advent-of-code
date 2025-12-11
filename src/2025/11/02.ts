import { Memo } from "../../../utils/memoize";
import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);

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

  const checkExitLeadsToYou: (
    index: string,
    dac: boolean,
    fft: boolean
  ) => number = memo.memoize((index: string, dac: boolean, fft: boolean) => {
    let passedThrough = 0;
    if (dac) {
      passedThrough += 1;
    }
    if (fft) {
      passedThrough += 1;
    }

    if (index === "svr" && dac && fft) {
      return 1;
    }

    const targets = devices.filter((d) => d.connections.includes(index));

    if (targets.length) {
      return targets
        .map((t) =>
          checkExitLeadsToYou(
            t.index,
            dac || index === "dac",
            fft || index === "fft"
          )
        )
        .reduce((acc, cur) => (acc += cur), 0);
    }
    return 0;
  });

  return devices
    .filter((d) => d.isExit)
    .map((d) => {
      const goesToYou = checkExitLeadsToYou(
        d.index,
        d.index === "dac",
        d.index === "fft"
      );
      console.log(d, goesToYou);
      return goesToYou;
    })
    .reduce((acc, cur) => {
      return (acc += cur);
    }, 0);
};
