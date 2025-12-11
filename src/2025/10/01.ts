import { readFileSync } from "fs";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

function fact(n: number) {
  let res = 1;
  for (let i = 1; i <= n; i++) {
    res *= i;
  }
  return res;
}

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  // [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
  // [...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
  // [.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}

  const splitInput = input.map((l) => l.split(" "));

  const endstates = splitInput.map((l) =>
    l[0]
      .replace("[", "")
      .replace("]", "")
      .split("")
      .map((c) => c === "#")
  );

  const buttonSets = splitInput.map((l) =>
    l
      .filter((entry) => entry.includes("("))
      .map((e) =>
        e
          .replace("(", "")
          .replace(")", "")
          .split(",")
          .map((c) => Number(c))
      )
  );

  // console.log(buttonSets);
  // console.log(buttonSets.flat().length);

  const remaining = splitInput.map((l) =>
    l[l.length - 1]
      .replace("{", "")
      .replace("}", "")
      .split(",")
      .map((c) => Number(c))
  );

  // console.log(endstates);
  // console.log(buttonSets);
  // console.log(remaining);

  // This part is from Chatsjie
  function uniqueCombinations<T>(arr: T[], n: number): T[][] {
    const result: T[][] = [];

    function backtrack(currentLightsIndex: number, path: T[]) {
      if (path.length === n) {
        result.push([...path]);
        return;
      }

      // Only pick elements at or after currentLightsIndex
      for (let i = currentLightsIndex; i < arr.length; i++) {
        path.push(arr[i]);
        backtrack(i + 1, path);
        path.pop();
      }
    }

    backtrack(0, []);
    return result;
  }

  const solutionLenghts = buttonSets.map((buttons, index) => {
    let n = 0;
    let solution = false;

    while (!solution && n <= buttons.length - 1) {
      n++;
      // console.log(n);

      let currentButtonOptions = uniqueCombinations(buttons, n);

      // console.log(JSON.stringify({ currentButtonOptions }));

      currentButtonOptions.forEach((options) => {
        if (solution) {
          return;
        }

        // console.log("\n");
        // console.log(options);
        let currentLights = [...endstates[index]].map(() => false);
        options.forEach((button) => {
          if (solution) {
            return;
          }

          // console.log(button);

          // console.log("start", currentLights);

          button.forEach((s) => {
            currentLights[s] = !currentLights[s];
            // console.log("\t", currentLights);
          });

          // console.log(
          //   currentLights.toString(),
          //   "---",
          //   endstates[index].toString()
          // );

          if (currentLights.toString() === endstates[index].toString()) {
            // console.log("solution found");
            solution = true;
          }
        });
      });
    }
    return n;
  });

  return solutionLenghts.reduce((acc, cur) => (acc += cur), 0);
};
