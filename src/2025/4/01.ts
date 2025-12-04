import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

type Position = {
  x: number;
  y: number;
  hasPaper: boolean;
  nNeighbours: number;
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  const positions = new Map<string, Position>();

  input.forEach((line, y) => {
    line.split("").forEach((c, x) => {
      if (c === ".") {
        positions.set(`${x}-${y}`, { x, y, hasPaper: false, nNeighbours: 0 });
      }
      if (c === "@") {
        positions.set(`${x}-${y}`, { x, y, hasPaper: true, nNeighbours: 0 });
      }
    });
  });

  const updateNeighbours = (p: Position) => {
    for (let _x = -1; _x < 2; _x++) {
      for (let _y = -1; _y < 2; _y++) {
        const key = `${p.x + _x}-${p.y + _y}`;
        const neighbour = positions.get(key);
        if ((_x === 0 && _y === 0) || !neighbour?.hasPaper) {
        } else if (neighbour) {
          positions.set(key, {
            ...neighbour,
            nNeighbours: neighbour.nNeighbours + 1,
          });
        }
      }
    }
  };

  positions.forEach((current, key) => {
    if (current.hasPaper) {
      updateNeighbours(current);
    }
  });

  console.log(positions);
  let total = 0;
  positions.forEach((current, key) => {
    if (current.nNeighbours <= 3 && current.hasPaper) {
      total += 1;
    }
  });

  return total;
};
