import { stringify } from "querystring";
import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file).map((line) => line.split(""));
  let position = { x: 0, y: 0 };
  let d = 0;
  let dirs = [
    { x: 0, y: -1, c: "^" },
    { x: 1, y: 0, c: ">" },
    { x: 0, y: 1, c: "v" },
    { x: -1, y: 0, c: "<" },
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

  const visited = [] as { position: { x: number; y: number }; d: number }[];
  let totalObs = new Set<string>();

  while (inside) {
    let newPos = { ...position };

    newPos.x += dirs[d].x;
    newPos.y += dirs[d].y;

    const nextLocation = input[newPos.y]?.[newPos.x];

    if (nextLocation && nextLocation !== ".") {
      d++;
      d = d % 4;
    }

    newPos = { ...position };

    newPos.x += dirs[d].x;
    newPos.y += dirs[d].y;

    inside = !!input[newPos.y]?.[newPos.x];
    position = newPos;

    if (inside) {
      visited.push({ position, d });
    }
  }

  console.log(new Set(visited.map((v) => JSON.stringify(v.position))).size);

  visited.forEach(({ position, d }) => {
    let valid = true;
    let mockDir = (d + 1) % 4;
    let mockPos = {
      x: position.x + dirs[mockDir].x,
      y: position.y + dirs[mockDir].y,
    };

    const obstaclePos = {
      x: position.x + dirs[d].x,
      y: position.y + dirs[d].y,
    };

    const example = false;
    // const example = position.x === 4 && position.y === 6;

    if (example) {
      console.log("--- from here ---", position, dirs[d].c);
      console.log(
        input
          .map((l, y) =>
            l
              .map((c, x) => {
                if (x === position.x && y === position.y) {
                  return "@";
                }
                if (x === obstaclePos.x && y === obstaclePos.y) {
                  return "O";
                }
                if (
                  visited.find((v) => v.position.x === x && v.position.y === y)
                ) {
                  return "X";
                }
                return c;
              })
              .join("")
          )
          .join("\n")
      );
    }

    let turns = [] as string[];

    while (valid) {
      const check = () => {
        const nextPosition = {
          x: mockPos.x + dirs[mockDir].x,
          y: mockPos.y + dirs[mockDir].y,
        };
        const nextStep = input[nextPosition.y]?.[nextPosition.x];
        if (!nextStep) {
          valid = false;
        }

        if (
          nextStep === "#" ||
          (nextPosition.x === obstaclePos.x && nextPosition.y === obstaclePos.y)
        ) {
          const turn = JSON.stringify({
            x: mockPos.x,
            y: mockPos.y,
            c: dirs[mockDir].c,
          });

          // if (example) {
          //   console.log("--- turn ---", turn, turns);
          // }

          if (turns.some((t) => t === turn)) {
            valid = false;
            totalObs.add(JSON.stringify(obstaclePos));
            // console.log(
            //   input
            //     .map((l, y) =>
            //       l
            //         .map((c, x) => {
            //           if (x === position.x && y === position.y) {
            //             return "@";
            //           }
            //           if (x === obstaclePos.x && y === obstaclePos.y) {
            //             return "O";
            //           }
            //           if (
            //             visited.find(
            //               (v) => v.position.x === x && v.position.y === y
            //             )
            //           ) {
            //             return "X";
            //           }
            //           return c;
            //         })
            //         .join("")
            //     )
            //     .join("\n")
            // );

            // if (example) {
            //   console.log("--- loop ---");
            // }
          }
          turns = [...turns, turn];
          mockDir = (mockDir + 1) % 4;
        }

        mockPos.x = mockPos.x + dirs[mockDir].x;
        mockPos.y = mockPos.y + dirs[mockDir].y;
      };
    }
  });
  return totalObs.size;
};
