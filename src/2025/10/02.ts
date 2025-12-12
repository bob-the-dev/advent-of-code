import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);
  const splitInput = input.map((l) => l.split(" "));

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

  // [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {1,1,0,1}
  // 31 32 31 32 31 01 32 02 31 01 3

  const targets = splitInput.map((l) =>
    l[l.length - 1]
      .replace("{", "")
      .replace("}", "")
      .split(",")
      .map((c) => Number(c))
  );

  let total = 0;

  targets.forEach((target, index) => {
    console.log(`\n\n---- TEST CASE ${index}----`);
    let currentStatus = [...target];
    console.log(currentStatus);

    let buttons = buttonSets[index].sort((a, b) => b.length - a.length);

    let iterations = 0;

    while (
      iterations <= target.reduce((acc, cur) => (acc += cur), 0) &&
      currentStatus.some((s) => s > 0)
    ) {
      const buttonOptions = buttons
        .filter((b) =>
          b.includes(currentStatus.indexOf(Math.max(...currentStatus)))
        )
        .map((b) => {
          return {
            button: b,
            n: b.reduce((acc, cur) => (acc += currentStatus[cur]), 0),
            lowestI: Math.min(...b),
          };
        });

      const currentButton = buttonOptions
        .sort((a, b) => a.lowestI - b.lowestI)
        .sort((a, b) => b.n - a.n)[0].button;

      if (!currentButton) {
        throw new Error("help");
      }

      console.log(currentButton);

      currentButton?.forEach((c) => currentStatus[c]--);

      console.log(currentStatus);
      buttons = buttons.filter((b) => !b.some((c) => currentStatus[c] === 0));
      iterations++;
    }

    console.log(`--- total steps ${iterations} --- `);
    total += iterations;
    // start with the first item in the hightest max array -> reduce the maxs of the indexes of the item -> go max value item of the current item (eg from 31, 3 has the highest max, 1 has the lowest) -> repeat;
    // if at any point the next item in the array is not viable, start at the first viable item in the highest max entry.
    // if at any point the next item in the array does not exist, start at the first viable item in the hightes max entry.

    // 31 31 10 10 20 31 32 32 2
    //  [
    //    { index: 3, max: 0, sButtons: ["3,1", "3,2", "3"] },
    //    { index: 1, max: 0, sButtons: ["3,1", "1,0"] },
    //    { index: 2, max: 0, sButtons: ["3,2", "2,0", "2"] },
    //    { index: 0, max: 0, sButtons: ["1,0", "2,0"] },
    //  ];

    // 2034, 2034, 201,
    // [
    //   { index: 2, max: 0, sButtons: ["2,0,3,4", "2,3,1,4", "2,0,1", "2,3"] },
    //   { index: 3, max: 0, sButtons: ["2,0,3,4", "2,3,1,4", "2,3"] },
    //   { index: 0, max: 0, sButtons: ["2,0,3,4", "2,0,1", "0,4"] },
    //   { index: 1, max: 0, sButtons: ["2,3,1,4", "2,0,1"] },
    //   { index: 4, max: 0, sButtons: ["2,0,3,4", "2,3,1,4", "0,4"] },
    // ];

    // 12043, 12043, 12043, 12043, 12043,
    // [
    //   { index: 1, max: 6, sButtons: ["1,2,0,4,5", "1,2"] },
    //   { index: 2, max: 6, sButtons: ["1,2,0,4,5", "1,2"] },
    //   { index: 0, max: 5, sButtons: ["1,2,0,4,5"] },
    //   { index: 4, max: 5, sButtons: ["1,2,0,4,5"] },
    //   { index: 5, max: 5, sButtons: ["1,2,0,4,5"] },
    // ];

    // let currentNumbers = target.map(() => 0);

    // let iterations = 0;
    // // let maxIterations = target.reduce((acc, cur) => (acc += cur), 0);
    // let maxIterations = 2;

    // let prioritized = target
    //   .map((t, _i) => {
    //     let buttons = buttonSets[index]
    //       ?.filter((buttons) => buttons.includes(_i))
    //       .map((buttons) =>
    //         buttons.sort((a, b) => {
    //           return target[b] - target[a];
    //         })
    //       )
    //       .sort((a, b) => target[b[0]] - target[a[0]])
    //       .sort((a, b) => b.length - a.length);

    //     return {
    //       index: _i,
    //       max: t,
    //       buttons,
    //       sButtons: buttons.map((b) => b.toString()),
    //     };
    //   })
    //   .sort((a, b) => a.buttons.length - b.buttons.length)
    //   .sort((a, b) => b.max - a.max);

    // let a = prioritized[0].index;
    // let b = 0;
    // let c = 0;

    // let nextButton = prioritized.find((p) => p.index === a)?.buttons[b];

    // while (
    //   iterations <= maxIterations &&
    //   !currentNumbers.some((g, i) => g === target[i])
    // ) {
    //   console.log(prioritized);
    //   console.log({ nextButton });

    //   if (!nextButton?.some((c) => prioritized.find((p) => p.index === c))) {
    //     if (a === 0) {
    //       b += 1;
    //       console.log("break");
    //       return;
    //     }
    //     a = 0;
    //     b = 0;
    //     console.log("break");
    //     return;
    //   }

    //   if (!nextButton) {
    //     console.log("break");
    //     return;
    //   }

    //   prioritized = prioritized
    //     .map((p) => {
    //       if (nextButton?.includes(p.index)) {
    //         return { ...p, max: p.max - 1 };
    //       }
    //       return p;
    //     })
    //     .filter((p) => p.max);

    //   const getNextButton = () => {
    //     return nextButton;
    //   };

    //   nextButton = getNextButton();

    //   const nexta = nextButton.find((_, _i) => _i >= c);

    //   let nextb = b;
    //   if (nexta === a) {
    //     b += 1;
    //   } else {
    //     a = nextb;
    //   }

    //   iterations += 1;
    // }
  });

  return total;
};
