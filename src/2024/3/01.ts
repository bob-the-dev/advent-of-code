import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  const exp = /mul\(\d+,\d+\)/g;

  const matches = input.join("/n").matchAll(exp);

  let total = 0;

  for (const match of matches) {
    const found = match[0].replaceAll("mul(", "").replaceAll(")", "");
    const [a, b] = found.split(",");

    console.log(a, b);

    total += Number(a) * Number(b);
  }

  return total;
};
