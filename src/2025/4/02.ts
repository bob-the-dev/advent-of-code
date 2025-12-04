import { mkdirSync, writeFile, writeFileSync } from "fs";
import * as prior from "./01";
import { argv } from "process";

type Position = {
  x: number;
  y: number;
  hasPaper: boolean;
  nNeighbours: number;
};

export const solution = async (file: string): Promise<string | number> => {
  console.log("Running part 2");
  const input = prior.getInput(file);

  const positions = new Map<string, Position>();

  let total = 0;
  let lastRemoved = Infinity;
  let nWidth = input[0].trim().length;
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

  while (lastRemoved > 0) {
    let display = "";

    positions.forEach((current) => {
      if (current.hasPaper) {
        display += "@";
      } else {
        display += ".";
      }

      if (current.x === nWidth - 1) {
        // console.log("should add newline");
        display += "\n";
      }
    });
    console.log(display);

    mkdirSync('./.output/day_04/test', { recursive: true },
    );
    
    writeFileSync(
      `./.output/day_04/${argv.find((v) => v === "--test") ? "test/" : ""
      }${total}.txt`,
      display,
    );

    let removedThisCycle = 0;

    positions.forEach((current) => {
      if (current.hasPaper) {
        updateNeighbours(current);
      }
    });

    positions.forEach((current, key) => {
      if (current.nNeighbours <= 3 && current.hasPaper) {
        removedThisCycle += 1;
        positions.set(key, { ...current, nNeighbours: 0, hasPaper: false });
      } else {
        positions.set(key, { ...current, nNeighbours: 0 });
      }
    });
    total += removedThisCycle;
    lastRemoved = removedThisCycle;
  }

  return total;
};
