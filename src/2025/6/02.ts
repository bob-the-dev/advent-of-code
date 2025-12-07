import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const sumSizes: { i: number; n: number; m: string }[] = [];
  let prev = 0;

  const input = prior.getInput(file);

  input[input.length - 1].split("").forEach((c, i) => {
    if (c !== " ") {
      // console.log(c, i);
      if (sumSizes[sumSizes.length - 1]) {
        sumSizes[sumSizes.length - 1].n = i - prev;
      }
      sumSizes.push({ i, n: i - prev, m: c });
      prev = i;
    }
    if (i === input[input.length - 1].length) {
      if (sumSizes[sumSizes.length - 1]) {
        sumSizes[sumSizes.length - 1].n = i - prev;
      }
    }
  });

  console.log(sumSizes);

  let sums: string[][] = [];

  sumSizes.forEach(({ i, n }) => {
    const vals: string[] = [];
    input.forEach((l) => {
      vals.push(l.substring(i, i + n - 1));
    });

    const transformed: string[] = [];
    vals[0].split("").forEach((_, i) => {
      let s = "";
      vals.forEach((v) => (s += v[i]));
      transformed.push(s.replace("*", "").replace("+", "").trim());
    });
    sums.push(transformed);
  });

  const totals = sumSizes.map(({ m }, index) => {
    let total = Number(sums[index][0]);
    for (let i = 1; i <= sums[index].length - 1; i++) {
      console.log(sums[index][i]);
      if (m === "*") {
        total *= Number(sums[index][i]);
      }
      if (m === "+") {
        total += Number(sums[index][i]);
      }
    }
    return total;
  });

  console.log(totals);

  return totals.reduce((acc, cur) => (acc += cur), 0);
};
