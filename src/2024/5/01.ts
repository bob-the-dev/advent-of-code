import { readFileSync } from "fs";

import { Memo } from "../../../utils/memoize";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);
  const all = input.join("\n");
  const [rules, updates] = all.split("\n\n").map((s) => s.split("\n"));

  const memo = new Memo();

  const checkOrder = memo.memoize((a: string, b?: string) => {
    if (!b) {
      return true;
    }
    const inOrder = rules.some((r) => {
      const [left, right] = r.split("|");
      return a === left && b === right;
    });
    return inOrder;
  });

  let total = 0;

  updates.forEach((upd) => {
    let entries = upd.split(",");
    let valid = true;

    while (valid && entries.length) {
      let thisValid = true;
      entries.forEach((entry, i) => {
        if (!thisValid) {
          return;
        }
        return (thisValid = checkOrder(entry, entries[i + 1]));
      });
      valid = thisValid;
      entries.shift();
    }
    if (valid) {
      const originalEntries = upd.split(",");
      const middleIndex = Math.floor(originalEntries.length / 2);
      total += Number(originalEntries[middleIndex]);
    }
  });

  return total;
};
