import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file).map((line) => line.split(""));
  let position = { x: 0, y: 0 };
  let d = 0;
  let dirs = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  position.y = input.findIndex((line) =>
    line.find((c, index) => {
      if (c === "^") {
        position.x = index;
        return true;
      }
      return false;
    })
  );

  input[position.y][position.x] = ".";

  let inside = true;

  const visited = new Map<string, boolean>();

  while (inside) {
    visited.set(JSON.stringify(position), true);

    let newPos = { ...position };

    newPos.x += dirs[d % 4].x;
    newPos.y += dirs[d % 4].y;

    const nextLocation = input[newPos.y]?.[newPos.x];

    if (nextLocation && nextLocation !== ".") {
      d++;
    }

    newPos = { ...position };

    newPos.x += dirs[d % 4].x;
    newPos.y += dirs[d % 4].y;

    inside = !!input[newPos.y]?.[newPos.x];
    position = newPos;
  }

  // console.log(
  //   input
  //     .map((l, y) =>
  //       l
  //         .map((c, x) => {
  //           if (visited.find((v) => v.x === x && v.y === y)) {
  //             return "X";
  //           }
  //           return c;
  //         })
  //         .join("")
  //     )
  //     .join("\n")
  // );

  return visited.size;
};
