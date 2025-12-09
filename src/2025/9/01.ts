import { readFileSync } from "fs";
import { Vector2 } from "three";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const begin = Date.now();

  const input = getInput(file);
  const coords = input.map((i) => {
    const [x, y] = i.split(",").map((c) => Number(c));
    return [x, y];
  });

  const getArea = () => {
    let options = coords;

    const dists: { from: number[]; to: number[]; area: number }[] = [];

    options.forEach((opt) => {
      options = options.slice(1, Infinity);
      options.forEach((_opt) => {
        const [x, y] = opt;
        const [u, v] = _opt;
        const area = (Math.abs(u - x) + 1) * (Math.abs(v - y) + 1);
        return dists.push({ from: opt, to: _opt, area });
      });
    });

    const largestAreas = dists.sort((a, b) => b.area - a.area);
    const largestArea = largestAreas[0];

    console.log(largestArea.area);
    return largestArea.area;
  };

  let area = getArea();

  const end = Date.now();

  console.log(`Duration ${end - begin}`);

  return area;
};
