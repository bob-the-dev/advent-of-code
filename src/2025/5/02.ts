import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const input = prior.getInput(file);

  let [first] = input;
  let ranges = first
    .split("\n")
    .filter((l) => l.includes("-"))
    .map((l) => {
      return l.split("-").map((r) => Number(r.trim()));
    });

  let consolidated: { start: number; end: number }[] = [];

  let shouldUpdate = true;

  const checkWithin = ([start, end]: number[]) => {
    let startIndices: number[] = [];
    let endIndices: number[] = [];
    let endNear = -1;
    let startNear = -1;

    endNear = consolidated.findIndex((c) => c.start === end + 1);
    if (endNear !== -1) {
      return (consolidated[endNear].start = start);
    }

    startNear = consolidated.findIndex((c) => c.end === start - 1);
    if (startNear !== -1) {
      return (consolidated[startNear].end = end);
    }

    consolidated.filter((current, index) => {
      if (start >= current.start && start <= current.end) {
        startIndices.push(index);
        return true;
      }
      return false;
    });

    consolidated.filter((current, index) => {
      if (end <= current.end && end >= current.start) {
        endIndices.push(index);
        return true;
      }
      return false;
    });

    console.log([start, end], startIndices, endIndices);

    if (
      startIndices.length === 1 &&
      endIndices.length === 1 &&
      startIndices[0] === endIndices[0]
    ) {
      return;
    }

    if (startIndices.length === 1) {
      const s = startIndices[0];
      return (consolidated[s].end = end);
    }

    if (endIndices.length === 1) {
      const e = endIndices[0];
      return (consolidated[e].start = start);
    }

    consolidated.push({ start, end });
  };

  let loops = 0;
  let prevConsolidated = consolidated;
  while (shouldUpdate) {
    loops += 1;

    ranges
      .sort((a, b) => a[0] - b[0])
      .forEach((r) => {
        checkWithin(r);
      });

    if (ranges.length === prevConsolidated.length) {
      shouldUpdate = false;
    }

    ranges = consolidated
      .map((c) => [c.start, c.end])
      .sort((a, b) => a[0] - b[0]);

    consolidated = [];
  }

  return ranges.reduce((acc, cur) => {
    return (acc += cur[1] - cur[0] + 1);
  }, 0);
};
