import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  const squares = input
    .filter((l) => !!l)
    .slice(0, 6)
    .map((s, index) => {
      const shape = s.split("\n").slice(1, 4).join("\n");
      return {
        index,
        shape,
      };
    });

  const challenges = input[input.length - 1]
    .split("\n")
    .filter((l) => !!l)
    .map((l) => {
      const [x, y] = l
        .split(":")[0]
        .split("x")
        .map((c) => Number(c));
      const shapesCounts = l
        .split(":")[1]
        .trim()
        .split(" ")
        .map((c) => Number(c));
      const combinedSize = shapesCounts.reduce(
        (acc, cur) => (acc += cur * 7),
        0
      );
      const area = x * y;
      const potentialFit = combinedSize <= area;
      const totalItems = shapesCounts.reduce((acc, cur) => (acc += cur), 0);
      const directFit =
        Math.floor(x / 3) * 3 * Math.floor(y / 3) * 3 >= totalItems * 9;

      return {
        x,
        y,
        shapesCounts,
        combinedSize,
        area,
        potentialFit,
        totalItems,
        directFit,
      };
    });

  const willFitRegardless = challenges.filter((c) => c.directFit).length;
  const wontFitRegardless = challenges.filter((c) => !c.potentialFit).length;

  let totalThatfit = willFitRegardless;

  console.log(`${willFitRegardless} will fit from the get-go.`);
  console.log(`${wontFitRegardless} won't fit from the get-go.`);

  console.log(
    `Remaining challenges to check: ${
      challenges.length - willFitRegardless - wontFitRegardless
    }`
  );

  return "";
};
