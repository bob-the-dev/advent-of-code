import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

type Coord = { x: number; y: number; dir?: { dX: number; dY: number } };

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  const perLetter = input.map((i) => i.split(""));

  const xOptions = [] as Coord[];

  perLetter.forEach((line, y) =>
    line.forEach((letter, x) => {
      if (letter === "X") {
        xOptions.push({ x, y });
      }
    })
  );

  // console.log(perLetter);
  // console.log(xOptions);
  /*
  MMMSXXMASM
  MSAMXMSMSA
  AMXSXMAAMM
  MSAMASMSMX
  XMASAMXAMM
  XXAMMXXAMA
  SMSMSASXSS
  SAXAMASAAA
  MAMMMXMMMM
  MXMXAXMASX
  */

  let total = 0;

  const tots = xOptions.map((option) => {
    // console.log("X", option);
    let mOptions = [] as Coord[];
    for (let dX = -1; dX < 2; dX++) {
      for (let dY = -1; dY < 2; dY++) {
        if (perLetter[option.y + dY]?.[option.x + dX] === "M") {
          mOptions.push({
            x: option.x + dX,
            y: option.y + dY,
            dir: { dX, dY },
          });
        }
      }
    }
    // console.log("M", mOptions);
    if (mOptions.length === 0) {
      return 0;
    }

    let aOptions = [] as Coord[];
    mOptions.forEach((mOpt) => {
      if (perLetter[mOpt.y + mOpt.dir!.dY]?.[mOpt.x + mOpt.dir!.dX] === "A") {
        aOptions.push({
          x: mOpt.x + mOpt.dir!.dX,
          y: mOpt.y + mOpt.dir!.dY,
          dir: { dX: mOpt.dir!.dX, dY: mOpt.dir!.dY },
        });
      }
    });

    // console.log("A", aOptions);
    if (aOptions.length === 0) {
      return 0;
    }

    let sOptions = [] as Coord[];

    aOptions.forEach((aOpt) => {
      if (perLetter[aOpt.y + aOpt.dir!.dY]?.[aOpt.x + aOpt.dir!.dX] === "S") {
        sOptions.push({
          x: aOpt.x + aOpt.dir!.dX,
          y: aOpt.y + aOpt.dir!.dY,
          dir: { dX: aOpt.dir!.dX, dY: aOpt.dir!.dY },
        });
      }
    });

    // console.log("S", sOptions);
    if (sOptions.length === 0) {
      return 0;
    }
    return sOptions.length;
  });

  return tots.reduce((acc: number, cur: number) => {
    return (acc += cur);
  }, 0);
};
