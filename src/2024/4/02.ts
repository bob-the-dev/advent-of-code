import * as prior from "./01";

type Coord = { x: number; y: number; dir?: { dX: number; dY: number } };

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);
  const perLetter = input.map((i) => i.split(""));

  const aOptions = [] as Coord[];

  perLetter.forEach((line, y) =>
    line.forEach((letter, x) => {
      if (letter === "A") {
        aOptions.push({ x, y });
      }
    })
  );

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

  const tots = aOptions.map((option) => {
    let tlbrMatch = true;
    let trblMatch = true;

    const tl = perLetter[option.y - 1]?.[option.x - 1];
    if (!tl) {
      return 0;
    }
    const br = perLetter[option.y + 1]?.[option.x + 1];
    if (!br) {
      return 0;
    }

    if (tl === "A" || br === "A" || br === "X" || tl === "X" || tl === br) {
      console.log("tlbr no match", option, tl, br);
      tlbrMatch = false;
    }

    if (tlbrMatch) {
      const tr = perLetter[option.y + 1]?.[option.x - 1];
      if (!tr) return 0;
      const bl = perLetter[option.y - 1]?.[option.x + 1];
      if (!bl) return 0;

      if (tr === "A" || bl === "A" || tr === "X" || bl === "X" || tr === bl) {
        trblMatch = false;
      }

      if (tlbrMatch && trblMatch) {
        console.log("A", option, tl, br, tr, bl);

        return 1;
      }
    }

    const t = perLetter[option.y - 1]?.[option.x];
    const b = perLetter[option.y + 1]?.[option.x];
    const l = perLetter[option.y]?.[option.x - 1];
    const r = perLetter[option.y]?.[option.x + 1];

    if (t === "A" || b === "A" || t === "X" || b === "X" || t === b) {
      return 0;
    }
    if (l === "A" || r === "A" || l === "X" || r === "X" || l === r) {
      return 0;
    }
    console.log("A", option, t, b, l, r);

    return 1;
  });
  const total = tots.reduce((acc: number, cur: number) => {
    return (acc += cur);
  }, 0);
  console.log(total);
  return total;
};
