import { Vector2 } from "three";
import * as prior from "./01";

export const solution = async (file: string): Promise<string | number> => {
  const begin = Date.now();
  const input = prior.getInput(file);

  const straightLines: { from: number[]; to: number[] }[] = [];

  const coords = input.map((i) => {
    const [x, y] = i.split(",").map((c) => Number(c));
    return [x, y];
  });

  let coordsCopy = [...coords];

  let current = coordsCopy[0];
  let first = coordsCopy[0];

  while (coordsCopy.length) {
    coordsCopy = coordsCopy.filter((_c) => {
      return _c.toString() !== current.toString();
    });

    const from = current;

    const [x, y] = from;
    const to = coordsCopy
      .filter(([u, v]) => u === x || v === y)
      ?.map(([u, v]) => {
        const dist = new Vector2(x, y).distanceTo(new Vector2(u, v));
        return { dist, to: [u, v] };
      })
      ?.sort((a, b) => {
        return a.dist - b.dist;
      })[0]?.to;

    current = to;

    if (to) {
      straightLines.push({ from, to });
    } else {
      straightLines.push({ from, to: first });
    }
  }

  // console.log(straightLines);

  const dists: { from: number[]; to: number[]; area: number }[] = [];
  coordsCopy = [...coords];

  coords.forEach((opt) => {
    coordsCopy = coordsCopy.slice(1, Infinity);
    coordsCopy.forEach((_opt) => {
      const [x, y] = opt;
      const [u, v] = _opt;
      const area = (Math.abs(x - u) + 1) * (Math.abs(v - y) + 1);
      return dists.push({ from: opt, to: _opt, area });
    });
  });

  // @ts-ignore
  function segmentsIntersect(a1, a2, b1, b2) {
    const [x1, y1] = a1;
    const [x2, y2] = a2;
    const [x3, y3] = b1;
    const [x4, y4] = b2;

    // @ts-ignore
    function ccw(p1, p2, p3) {
      return (
        (p3[1] - p1[1]) * (p2[0] - p1[0]) > (p2[1] - p1[1]) * (p3[0] - p1[0])
      );
    }

    return (
      ccw(a1, b1, b2) !== ccw(a2, b1, b2) && ccw(a1, a2, b1) !== ccw(a1, a2, b2)
    );
  }

  // @ts-ignore
  function isPointOnLine(px, py, x1, y1, x2, y2) {
    // Check for collinearity using cross product
    const cross = (py - y1) * (x2 - x1) - (px - x1) * (y2 - y1);
    if (cross !== 0) return false;

    // Check if the point is within the segment bounds
    if (
      px >= Math.min(x1, x2) &&
      px <= Math.max(x1, x2) &&
      py >= Math.min(y1, y2) &&
      py <= Math.max(y1, y2)
    ) {
      return true;
    }

    return false;
  }
  const checkIfOnAnExistingLine = (point: { x: number; y: number }) => {
    return straightLines.some((sl) => {
      return isPointOnLine(
        point.x,
        point.y,
        sl.from[0],
        sl.from[1],
        sl.to[0],
        sl.to[1]
      );
    });
  };

  // @ts-ignore
  function isPointInPolygon(point, polygon) {
    const [px, py] = point;
    let inside = false;
    let c = 0;

    // const startsOnLine = checkIfOnAnExistingLine({ x: px, y: py });
    // if (startsOnLine) {
    //   c++;
    //   inside = !inside;
    // }

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      const intersect =
        yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
      if (intersect) {
        c++;
        inside = !inside;
      }
    }

    return { inside, c };
  }

  const polyPoints = straightLines.map((l) => l.from);

  // @ts-ignore
  function isLineGoesThroughArea(
    [ax, ay, bx, by]: number[],
    corner1: number[],
    corner2: number[]
  ) {
    const [x1, y1] = corner1;
    const [x2, y2] = corner2;

    // Get bounding box coordinates
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    // Check if a point is strictly inside the rectangle
    function pointInside(x: number, y: number) {
      return minX < x && x < maxX && minY < y && y < maxY;
    }

    // If either endpoint is strictly inside, line "enters"
    if (pointInside(ax, ay) || pointInside(bx, by)) {
      return true;
    }

    // Liang–Barsky line clipping
    let dx = bx - ax;
    let dy = by - ay;

    let p = [-dx, dx, -dy, dy];
    let q = [ax - minX, maxX - ax, ay - minY, maxY - ay];

    let u1 = 0.0;
    let u2 = 1.0;

    for (let i = 0; i < 4; i++) {
      let pi = p[i];
      let qi = q[i];

      if (pi === 0) {
        if (qi <= 0) {
          return false; // Parallel and outside
        }
      } else {
        let t = qi / pi;
        if (pi < 0) {
          if (t > u2) return false;
          if (t > u1) u1 = t;
        } else {
          if (t < u1) return false;
          if (t < u2) u2 = t;
        }
      }
    }

    // If u1 == u2 → intersection is a single point → only touching
    return u1 < u2;
  }

  const areas = dists
    .sort((a, b) => b.area - a.area)
    .filter((d) => {
      const oppositeCorners = [
        { x: d.from[0], y: d.to[1] },
        { x: d.to[0], y: d.from[1] },
      ];

      // console.log("\n");
      // console.log(d);
      // console.log({ oppositeCorners });

      const isOutside = oppositeCorners.some(({ x, y }) => {
        const onLine = checkIfOnAnExistingLine({ x, y });
        if (onLine) {
          // console.log({ x, y }, "on the edge");
          return false;
        }
        const { inside: insidePoly, c } = isPointInPolygon([x, y], polyPoints);

        if (insidePoly) {
          // console.log(x, y, "crosses ", c, " boundaries");
          if (c > 1) {
            return true;
          }
          // console.log({ x, y }, "is inside");
          return false;
        }
        // console.log({ x, y }, "seems outside");
        return true;
      });

      if (isOutside) {
        // console.log("Part of rect is outside \n");
        return !isOutside;
      }

      const enters = straightLines.find((sl) => {
        const doesEnter = isLineGoesThroughArea(
          [...sl.from, ...sl.to],
          [oppositeCorners[0].x, oppositeCorners[0].y],
          [oppositeCorners[1].x, oppositeCorners[1].y]
        );
        return doesEnter;
      });

      if (enters) {
        // console.log(enters, d);
        return false;
      }

      return true;
    });

  console.log(`Duration ${Date.now() - begin}`);
  return areas?.[0].area;
};
