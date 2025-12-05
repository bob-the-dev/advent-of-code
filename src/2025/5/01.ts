import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\r\n\r");
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  console.log(input);

  let [first, second] = input;
  let ranges = first.split("\n").map((l) => {
    return l.split("-").map((r) => Number(r));
  });

  let ingredients = second.split("\n").map((l) => Number(l));

  console.log(ranges);
  console.log(ingredients);

  let total = 0;
  ingredients.forEach((ing) => {
    if (
      ranges.some(([from, to]) => {
        if (ing >= from && ing <= to) {
          return true;
        }
      })
    ) {
      total += 1;
    }
  });

  return total;
};
