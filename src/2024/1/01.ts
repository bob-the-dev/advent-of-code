import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string) => {
  const input = getInput(file);

  const left = [] as number[];
  const right = [] as number[];

  input.forEach((line) => {
    const [l, r] = line.split("   ");
    left.push(Number(l));
    right.push(Number(r));
  });

  left.sort();
  right.sort();

  let total = 0;
  left.forEach((num, index) => {
    total += Math.abs(num - right[index]);
  });

  return total;
};
