import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);

  const output = input.map((line) => {
    let finished = false;
    let index = 0;

    const entries = line.split(" ").map((e) => Number(e));
    let safe = true;

    while (!finished) {
      let prev: number | undefined = undefined;
      let copy = [...entries];
      copy.splice(index, 1);
      safe = true;

      copy.forEach((e, i) => {
        if (!copy[i + 1]) {
          return;
        }
        const diff = copy[i + 1] - e;

        if (diff > 3 || diff < -3 || diff === 0) {
          return (safe = false);
        }
        if (!prev) {
          prev = Math.sign(diff);
        }
        if (prev !== Math.sign(diff)) {
          return (safe = false);
        }
        prev = Math.sign(diff);
      });

      if (safe === true || index === entries.length - 1) {
        finished = true;
      }
      index++;
    }

    return safe;
  });

  return output.filter((i) => !!i).length;
};
