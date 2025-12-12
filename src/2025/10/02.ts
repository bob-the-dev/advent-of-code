import * as prior from "./01";

import { Arith, init as initZ3Solver } from "z3-solver";

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

  const targets = splitInput.map((l) =>
    l[l.length - 1]
      .replace("{", "")
      .replace("}", "")
      .split(",")
      .map((c) => Number(c))
  );

  // Stole this from Rik Claessens
  const solveWithZ3 = async (
    joltage: number[],
    buttons: number[][]
  ): Promise<number> => {
    const { Context } = await initZ3Solver();
    const { Int, Optimize } = Context("main");
    const solver = new Optimize();

    // Create press count variables for each button
    const buttonPresses: Arith[] = [];
    for (let i = 0; i < buttons.length; i++) {
      buttonPresses.push(Int.const(`b_${i}`));
    }

    // Button press count must be >= 0
    for (const count of buttonPresses) {
      solver.add(count.ge(0));
    }

    // For each position, the total of button presses affecting it must equal the joltage value
    for (let pos = 0; pos < joltage.length; pos++) {
      const affects: Arith[] = [];
      for (let idx = 0; idx < buttons.length; idx++) {
        if (buttons[idx].includes(pos)) {
          affects.push(buttonPresses[idx]);
        }
      }
      // total of affecting buttons equals the joltage at this position
      const total =
        affects.length > 0
          ? affects.reduce((a, v) => a.add(v), Int.val(0))
          : Int.val(0);
      solver.add(total.eq(Int.val(joltage[pos])));
    }

    // Minimize total presses
    const totalPresses = buttonPresses.reduce((a, v) => a.add(v), Int.val(0));
    solver.minimize(totalPresses);

    const result = await solver.check();

    if (result === "sat") {
      const model = solver.model();
      let total = 0;
      for (const pressCount of buttonPresses) {
        const val = model.eval(pressCount).toString();
        total += parseInt(val, 10);
      }
      return total;
    }
    throw new Error("No solution found");
  };

  const drawProgressBar = (progress: number) => {
    const barWidth = 30;
    const filledWidth = Math.floor((progress / 100) * barWidth);
    const emptyWidth = barWidth - filledWidth;
    const progressBar = "█".repeat(filledWidth) + "▒".repeat(emptyWidth);
    return `[${progressBar}]`;
  };

  const findFewestNumberOfButtonPressesPart2LP = async (
    buttons: number[][],
    target: number[]
  ): Promise<number> => {
    return solveWithZ3(target, buttons);
  };

  let total = 0;
  const results: number[] = [];

  for (let i = 0; i < buttonSets.length; i++) {
    console.log(
      `${drawProgressBar((i / buttonSets.length) * 100)} Buttonset ${i} / ${
        buttonSets.length
      } \r`
    );

    const buttons = buttonSets[i];
    const target = targets[i];

    const result = await findFewestNumberOfButtonPressesPart2LP(
      buttons,
      target
    );
    results.push(result);
  }

  console.log(
    `${drawProgressBar(100)} Buttonset ${buttonSets.length} / ${
      buttonSets.length
    } \r`
  );

  total = results.reduce((acc, cur) => acc + cur, 0);

  // SOLUTION THAT ONLY NAIVELY WORKED FOR TEST DATA

  // console.log(buttonSets);
  // console.log(buttonSets.flat().length);

  // [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {1,1,0,1}
  // 31 32 31 32 31 01 32 02 31 01 3

  // const targets = splitInput.map((l) =>
  //   l[l.length - 1]
  //     .replace("{", "")
  //     .replace("}", "")
  //     .split(",")
  //     .map((c) => Number(c))
  // );

  // let total = 0;

  // targets.forEach((target, index) => {
  //   console.log(`\n\n---- TEST CASE ${index}----`);
  //   let currentStatus = [...target];
  //   console.log(currentStatus);

  //   let buttons = buttonSets[index].sort((a, b) => b.length - a.length);

  //   let iterations = 0;

  //   while (
  //     iterations <= target.reduce((acc, cur) => (acc += cur), 0) &&
  //     currentStatus.some((s) => s > 0)
  //   ) {
  //     const buttonOptions = buttons
  //       .filter((b) =>
  //         b.includes(currentStatus.indexOf(Math.max(...currentStatus)))
  //       )
  //       .map((b) => {
  //         return {
  //           button: b,
  //           n: b.reduce((acc, cur) => (acc += currentStatus[cur]), 0),
  //           lowestI: Math.min(...b),
  //         };
  //       });

  //     const currentButton = buttonOptions
  //       .sort((a, b) => a.lowestI - b.lowestI)
  //       .sort((a, b) => b.n - a.n)[0].button;

  //     if (!currentButton) {
  //       throw new Error("help");
  //     }

  //     console.log(currentButton);

  //     currentButton?.forEach((c) => currentStatus[c]--);

  //     console.log(currentStatus);
  //     buttons = buttons.filter((b) => !b.some((c) => currentStatus[c] === 0));
  //     iterations++;
  //   }

  //   console.log(`--- total steps ${iterations} --- `);
  //   total += iterations;
  // });

  return total;
};
