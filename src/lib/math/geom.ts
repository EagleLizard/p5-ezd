
export type Point = {
  x: number;
  y: number;
} & {};

export const geom = {
  endPoint: endPoint,
  dist: dist,
} as const;

function endPoint(
  x1: number,
  y1: number,
  len: number,
  degs: number
): [x2: number, y2: number] {
  let theta = degs * (Math.PI / 180);
  let x2 = x1 + len * Math.cos(theta);
  let y2 = y1 + len * Math.sin(theta);
  return [ x2, y2 ];
}

function dist(p1: Point, p2: Point, opts = { rel: false }) {
  /* a^2 + b^2 = c^2 */
  let dx = Math.abs(p1.x - p2.x);
  let dy = Math.abs(p1.y - p2.y);
  let relDist = dx^2 + dy^2;
  if(opts.rel) {
    return relDist;
  }
  return Math.sqrt(relDist);
}
