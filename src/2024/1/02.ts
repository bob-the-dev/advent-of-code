import { log } from "../../../utils/log";
import * as prior from "./01";

export const solution = async (file: string) => {
  const input = prior.getInput(file);

  log(input);

  const left = [] as number[];
  const right = [] as number[];

  input.forEach((line) => {
    const [l, r] = line.split("   ");
    left.push(Number(l));
    right.push(Number(r));
  });

  log(left);
  log(right);

  let total = 0;

  left.forEach((num) => {
    total += num * right.filter((i) => i === num).length;
  });

  return total;
};
