import { readFileSync } from "fs";
import { isNumberObject } from "util/types";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  let linesOutput: number[] = [];
  const getHighest = (s: string) => {
    let record = { index: 0, highest: 0, dupe: false, lastTwo: false };
    const numbers = s
      .split("")
      .map((_n) => Number(_n))
      .filter((n) => !isNaN(n) && n > 0);

    numbers.forEach((n, index) => {
      if (index !== numbers.length - 1) {
        if (n > record.highest) {
          record.highest = n;
          record.index = index;
        }
      }
    });

    const remainder = numbers.slice(record.index + 1, Infinity);
    let secondDigit = 0;
    remainder.forEach((_n) => {
      const n = Number(_n);
      if (n >= secondDigit) {
        secondDigit = n;
      }
    });
    // console.log("Found regular:", Number(`${record.highest}${secondDigit}`));
    return linesOutput.push(Number(`${record.highest}${secondDigit}`));
  };

  input.forEach((line) => {
    getHighest(line);
  });

  return linesOutput.reduce((acc, cur) => {
    // console.log(cur);
    return (acc += cur);
  }, 0);
};
