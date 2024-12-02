import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  const output = input.map((line) => {
    let safe = true;

    const entries = line.split(" ").map((e) => Number(e));

    let prev: number | undefined = undefined;

    entries.forEach((e, i) => {
      if (!entries[i + 1]) {
        return;
      }
      const diff = entries[i + 1] - e;

      if (diff > 3 || diff < -3 || diff === 0) {
        return (safe = false);
      }
      if (!prev) {
        return (prev = Math.sign(diff));
      }
      if (prev !== Math.sign(diff)) {
        return (safe = false);
      }
      prev = Math.sign(diff);
    });

    return safe;
  });

  return output.filter((i) => !!i).length;
};
