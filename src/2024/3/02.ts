import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);

  const oneLine = input.join("/n");

  const dos = oneLine.split("do()").map((l) => l.split(`don't`)[0]);

  const exp = /mul\(\d+,\d+\)/g;

  const matches = dos.join("/n").matchAll(exp);

  let total = 0;

  for (const match of matches) {
    const found = match[0].replaceAll("mul(", "").replaceAll(")", "");
    const [a, b] = found.split(",");

    total += Number(a) * Number(b);
  }

  return total;
};
