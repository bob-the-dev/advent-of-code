import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);

  const getHighest = (s: string) => {
    let numbers = s
      .split("")
      .map((_n) => Number(_n))
      .filter((n) => !isNaN(n) && n > 0);

    while (numbers.length > 12) {
      const toRemove = numbers.findIndex((n, i) => {
        if (i === numbers.length - 1) {
          return true;
        }
        if (i !== numbers.length - 1) {
          const next = Number(numbers[i + 1]);
          if (Number(n) < next) {
            return true;
          }
          return false;
        }
        return false;
      });

      numbers = numbers.filter((_, i) => i !== toRemove);
    }
    return Number(numbers.join(""));
  };

  return input
    .map((line) => {
      return getHighest(line);
    })
    .reduce((acc, cur) => {
      return (acc += cur);
    }, 0);
};
