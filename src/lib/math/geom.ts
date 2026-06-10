
type Point = {
  x: number;
  y: number;
} & {};

export const geom = {
  endPoint,
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
