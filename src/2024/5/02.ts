import { Memo } from "../../../utils/memoize";
import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);

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
    // console.log(inOrder, a, b);
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
    if (!valid) {
      //  put the originalEntries in order based on rules.
      const originalEntries = upd.split(",");

      const unsorted = originalEntries.map((e) => {
        const totalBehind = rules.filter((rule) => {
          const [left, right] = rule.split("|");
          return left === e && originalEntries.find((oe) => oe === right);
        }).length;

        return { e, n: totalBehind };
      });
      const sorted = unsorted.sort((a, b) => b.n - a.n).map((e) => e.e);
      const middleIndex = Math.floor(sorted.length / 2);
      total += Number(sorted[middleIndex]);
    }
  });
  return total;
};
