import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);

  const lines: [string, string][] = input.map((l) => {
    const left = l.split("-")[0];
    const right = l.split("-")[1];
    return [left, right];
  });

  const mappedValues = new Map<number, boolean>();

  let total = 0;

  const checkRepetition = (n: number) => {
    console.log("Checking for", n);
    const prevValue = mappedValues.get(n);

    if (prevValue) {
      return n;
    }

    const s = n.toString();
    const l = s.length;

    for (let i = 1; i <= l / 2; i++) {
      if (l % i !== 0) {
        continue;
      }

      // finds all parts of i length
      let parts: string[] = [];

      for (let j = 0; j < l - (i - 1); j += i) {
        parts.push(s.substring(j, j + i));
      }

      if (parts.every((p) => p === parts[0])) {
        mappedValues.set(n, true);
        return n;
      }
    }

    mappedValues.set(n, false);
    return 0;
  };

  const checkInvalid = ([l, r]: [string, string]) => {
    let start = Number(l);
    let end = Number(r);

    if (!(end && start) || end <= start) {
      return 0;
    }

    while (end - start >= 0) {
      total += checkRepetition(start);
      start += 1;
    }
  };

  lines.forEach((l) => checkInvalid(l));
  return total;
};
