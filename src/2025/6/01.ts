import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file).map((l) => l.replaceAll(/  +/g, " ").trim());
  console.log(input);
  let sums: string[][] = [];

  input[0].split(" ").forEach((_, i) => {
    const values: string[] = [];
    input.forEach((l) => values.push(l.split(" ")[i]));
    sums.push(values);
  });

  const checkSum = (sum: string[]) => {
    const method = sum[sum.length - 1];
    let total = Number(sum[0]);

    for (let i = 1; i <= sum.length - 2; i++) {
      if (method === "*") {
        total *= Number(sum[i]);
      }
      if (method === "+") {
        total += Number(sum[i]);
      }
    }

    return total;
  };

  return sums.map((sum) => checkSum(sum)).reduce((acc, cur) => (acc += cur), 0);
};
