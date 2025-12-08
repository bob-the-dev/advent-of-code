import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const begin = new Date().getMilliseconds();

  const positions = getInput(file).map((l) => l.split(""));

  const startIndex = positions[0].findIndex((c) => c === "S");
  const startLine = 0;

  let accessed = new Map<string, number>();

  const drawBeam = (index: number, line: number) => {
    const prev = accessed.get(`${index} - ${line}`);

    if (prev === undefined) {
      const under = positions[line + 1]?.[index];
      if (under !== undefined) {
        if (under !== "^") {
          positions[line + 1][index] = "|";
          drawBeam(index, line + 1);
        } else {
          const l = index - 1;
          const r = index + 1;
          accessed.set(`${index} - ${line}`, 1);
          positions[line + 1][l] = "|";
          positions[line + 1][r] = "|";

          drawBeam(l, line + 1);
          drawBeam(r, line + 1);
        }
      }
    }
  };

  drawBeam(startIndex, startLine);
  console.log(accessed);
  // console.log(positions.map((l) => l.join("")).join("\n"));

  const end = new Date().getMilliseconds();

  console.log(end - begin);

  return accessed.size;
};
