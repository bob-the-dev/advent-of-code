import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = (file: string): string | number => {
  const input = getInput(file);

  const rotations = input.map((l) => {
    const dir = l[0] === "L" ? -1 : 1;
    return Number(l.substring(1)) * dir;
  });

  let value = 50;
  let nZero = 0;

  rotations.forEach((r) => {
    value += r;
    if (value % 100 === 0) {
      nZero += 1;
    }
  });
  return nZero;
};
