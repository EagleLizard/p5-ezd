import { geom, Point } from '../math/geom';

export class QuadNode {
  pos: Point;
  data: number;
  constructor(pos: Point, data: number) {
    this.pos = pos;
    this.data = data;
  }
}

export class Quad {
  min_size = 7;
  n?: QuadNode;
  tl: Point;
  br: Point;
  ne?: Quad;
  nw?: Quad;
  se?: Quad;
  sw?: Quad;
  constructor(topLeft: Point, bottomRight: Point) {
    this.tl = topLeft;
    this.br = bottomRight;
  }
  insert(qNode: QuadNode) {
    if(!this.inBound(qNode.pos)) {
      return;
    }
    if(this.n === undefined) {
      this.n = qNode;
      return;
    }
    if(!this.canSubdivide()) {
      return;
    }

    let midPoint = this.getMidPoint();

    /* find which child tree contains the point */
    let mid_x = midPoint.x;
    let mid_y = midPoint.y;
    let npt = qNode.pos;
    if(
      npt.x >= this.tl.x
      && npt.x <= mid_x
      && npt.y >= this.tl.y
      && npt.y <= mid_y
    ) {
      /* NW */
      if(this.nw === undefined) {
        this.nw = new Quad({ x: this.tl.x, y: this.tl.y }, { x: mid_x, y: mid_y });
      }
      this.nw.insert(qNode);
    } else if (
      npt.x >= mid_x
      && npt.x <= this.br.x
      && npt.y >= this.tl.y
      && npt.y <= mid_y
    ) {
      /* NE */
      if(this.ne === undefined) {
        this.ne = new Quad({ x: mid_x, y: this.tl.y}, { x: this.br.x, y: mid_y });
      }
      this.ne.insert(qNode);
    } else if(
      npt.x >= this.tl.x
      && npt.x <= mid_x
      && npt.y >= mid_y
      && npt.y <= this.br.y
    ) {
      /* SW */
      if(this.sw === undefined) {
        this.sw = new Quad({ x: this.tl.x, y: mid_y }, { x: mid_x, y: this.br.y })
      }
      this.sw.insert(qNode);
    } else if(
      npt.x >= mid_x
      && npt.x <= this.br.x
      && npt.y >= mid_y
      && npt.y <= this.br.y
    ) {
      /* SE */
      if(this.se === undefined) {
        this.se = new Quad({ x: mid_x, y: mid_y }, { x: this.br.x, y: this.br.y });
      }
      this.se.insert(qNode);
    } else {
      /* error - out of bounds */
      throw new Error(`node ${qNode.data} out of bounds, pos: ( ${npt.x}, ${npt.y} )`);
    }
  }
  canSubdivide() {
    return Math.min(this.w(), this.h())/2 > this.min_size;
  }
  inBound(pt: Point): boolean {
    return (
      pt.x >= this.tl.x
      && pt.x <= this.br.x
      && pt.y >= this.tl.y
      && pt.y <= this.br.y
    );
  }
  w(): number {
    return this.br.x - this.tl.x;
  }
  h(): number {
    return this.br.y - this.tl.y;
  }
  getMidPoint(): Point {
    return { x: this.tl.x + this.w() / 2, y: this.tl.y + this.h() / 2 };
  }
}
