import { mkdirSync, readFileSync } from "fs";
import path from "path";
import { Vector3 } from "three";

export const getInput = (file: string) => {
  const fileContent = readFileSync(file, "utf-8");
  return fileContent.split("\n");
};

type Point = {
  v: Vector3;
  nearest?: Point;
  d?: number;
};

export const solution = async (file: string): Promise<string | number> => {
  const input = getInput(file);

  // mkdirSync(path.join(__dirname, ".output/day_08/test"), { recursive: true });

  // const filePath = path.join(
  //   __dirname,
  //   ".output",
  //   "day_08",
  //   process.argv.find((arg) => arg === "--test") ? "test" : "",
  //   "part_one.html"
  // );

  const test = process.argv.find((arg) => arg === "--test");

  let nCheck = test ? 10 : 1000;

  let circuits: string[][] = [];

  let points: { x: number; y: number; z: number }[] = [];
  const distances: { d: number; from: string; to: string }[] = [];

  input.forEach((l) => {
    const [x, y, z] = l.split(",").map((c) => Number(c.trim()));
    points.push({ x, y, z });
  });

  points.forEach((p) => {
    points = points.slice(1, Infinity);
    points.forEach((_p) => {
      let from = `${p.x},${p.y},${p.z}`;
      let to = `${_p.x},${_p.y},${_p.z}`;
      distances.push({
        d: new Vector3(p.x, p.y, p.z).distanceTo(new Vector3(_p.x, _p.y, _p.z)),
        from,
        to,
      });
    });
  });

  const sorted = distances.sort((a, b) => a.d - b.d);

  console.log(sorted);

  sorted.forEach(({ from, to }) => {
    if (nCheck <= 0) {
      return;
    }

    console.log("\n");

    const existingTo = circuits.findIndex(
      (c) => c.includes(to) && !c.includes(from)
    );
    const existingFrom = circuits.findIndex(
      (c) => c.includes(from) && !c.includes(to)
    );

    const hasBoth = circuits.findIndex(
      (c) => c.includes(to) && c.includes(from)
    );
    if (hasBoth >= 0) {
      nCheck -= 1;
      console.log("Skipping", from, "~", to);
      console.log("Both exists in", circuits[hasBoth]);
      return;
    }

    const doesNotExistYet = existingFrom === existingTo && existingTo === -1;

    if (doesNotExistYet) {
      nCheck -= 1;
      console.log("Adding new circuit");
      circuits.push([from, to]);
      return console.log("Circuit created", circuits[circuits.length - 1]);
    }

    if (existingFrom >= 0 && existingTo >= 0 && existingFrom !== existingTo) {
      console.log(from, to);
      console.log(`Found from and to in different circuits`);
      nCheck -= 1;
      circuits[existingFrom] = [
        ...circuits[existingFrom],
        ...circuits[existingTo],
      ];
      circuits[existingTo] = [];

      circuits = circuits.filter((c) => c.length);
      console.log(circuits);
      return;
    }

    if (existingFrom >= 0) {
      nCheck -= 1;
      console.log("Adding to circuit", to);
      circuits[existingFrom].push(to);
      return console.log("Circuit updated", circuits[existingFrom]);
    }

    if (existingTo >= 0) {
      nCheck -= 1;
      console.log("Adding to circuit", from);
      circuits[existingTo].push(from);
      return console.log("Circuit updated", circuits[existingTo]);
    }
  });

  console.log(
    "result",
    circuits.sort((a, b) => b.length - a.length)
  );

  // writeFileSync(
  //   filePath,
  //   `<!DOCTYPE html>
  //   <head>
  //     <script src="https://d3js.org/d3.v7.min.js"></script>
  //     <script src="https://create3000.github.io/code/x_ite/latest/x_ite.js"></script>
  //     <script src="https://raw.githack.com/jamesleesaunders/d3-x3d/master/dist/d3-x3d.js"></script>
  //   </head>
  //   <body>
  //     <x3d-canvas id="chartholder"/>
  //     <script>

  //     // Generate some data

  //     var chartHolder = d3.select("#chartholder");
  //     chartHolder.attr("style", "height: 1000px; width: 1000px");

  //     let myChart = d3.x3d.chart
  //       .particlePlot()
  //       .colors(["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"])
  //       .mappings({x: "x", y: "y", z: "z", size: "size", color: "weight"})
  //       .width(800)
  //       .height(800);

  //       const data = ${JSON.stringify({
  //         key: "Junction Boxes",
  //         values: input.map((line, index) => {
  //           const [x, y, z] = line.split(",").map((c) => Number(c.trim()));
  //           return {
  //             key: `Point ${index + 1}`,
  //             values: [
  //               { key: "weight", value: Math.random() },
  //               { key: "size", value: 0.1 },
  //               { key: "x", value: x },
  //               { key: "y", value: y },
  //               { key: "z", value: z },
  //             ],
  //           };
  //         }),
  //       })}
  //       console.log(data);
  //       chartHolder.datum(data).call(myChart);
  //     </script>
  //   </body>
  // `
  // );

  return circuits
    .sort((a, b) => b.length - a.length)
    .slice(0, 3)
    .reduce((acc, cur) => (acc *= cur.length), 1);
};
