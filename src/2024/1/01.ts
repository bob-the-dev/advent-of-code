import { readFileSync } from "fs";
import { log } from "../../../utils/log";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  // log(input);

  const left = [] as string[];
  const right = [] as string[];

  input.forEach((line) => {
    const [l, r] = line.split("   ");
    left.push(l);
    right.push(r);
  });

  left.sort();
  right.sort();

  // log(left);
  // log(right);

  let total = 0;
  left.forEach((num, index) => {
    total += Math.abs(Number(num) - Number(right[index]));
  });

  // console.log(total);

  return total;
};
