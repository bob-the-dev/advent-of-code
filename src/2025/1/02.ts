import * as prior from "./01";

export const solution = (file: string): string | number => {
  const input = prior.getInput(file);

  const rotations = input.map((l) => {
    const dir = l[0] === "L" ? -1 : 1;
    return [Number(l.substring(1)), dir];
  });

  let value = 50;
  let nZero = 0;

  rotations.forEach(([amount, direction]) => {
    let steps = amount;
    while (steps) {
      value += direction;
      if (value % 100 === 0) {
        nZero += 1;
      }
      steps -= 1;
    }
  });
  return nZero;
};
