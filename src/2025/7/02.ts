import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const begin = new Date().getMilliseconds();

  const positions = prior.getInput(file).map((l) => l.split(""));

  const startIndex = positions[0].findIndex((c) => c === "S");
  const startLine = 0;
  let accessed = new Map<string, boolean>();

  const drawBeam = (index: number, line: number) => {
    const under = positions[line + 1]?.[index];
    if (under === undefined) {
      return;
    }
    if (accessed.get(`${index} - ${line}`) === undefined) {
      if (under !== "^") {
        positions[line + 1][index] = "|";
        drawBeam(index, line + 1);
      } else {
        const l = index - 1;
        const r = index + 1;
        accessed.set(`${index} - ${line}`, true);
        positions[line + 1][l] = "|";
        positions[line + 1][r] = "|";

        drawBeam(l, line + 1);
        drawBeam(r, line + 1);
      }
    }
  };
  drawBeam(startIndex, startLine);

  let values = positions.map((l) => l.map((c) => 0));

  positions.forEach((line, y) => {
    line.forEach((l, x) => {
      if (l === "S") {
        values[y][x] = 1;
        positions[y][x] = "|";
      }
      if (l === "|") {
        values[y][x] += values[y - 1][x] ?? 0;
        if (positions[y][x - 1] === "^") {
          values[y][x] += values[y - 1][x - 1] ?? 0;
        }
        if (positions[y][x + 1] === "^") {
          values[y][x] += values[y - 1][x + 1] ?? 0;
        }
      }
    });
  });

  const end = new Date().getMilliseconds();

  console.log("Duration", end - begin);

  return values[values.length - 1].reduce((acc, cur) => (acc += cur), 0);
};
