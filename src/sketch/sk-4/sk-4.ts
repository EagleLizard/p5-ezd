
import p5 from 'p5';
import { ezdElems } from '../../app/ezd-elems';
import { ezdSk, IEzdSketch, SkElems } from '../../app/ezd-sk';
import { Point } from '../../lib/math/geom';

const skId = 'sk-4';

export const sk4 = {
  id: skId,
  init: sk4Init,
};

/*
entities:
  building
    position
  floor
  shaft
  elevator car
_*/
class Entity {
  static _idInc = 0;

  id: number;

  constructor() {
    this.id = Entity.genId();
  }

  static genId(): number {
    return Entity._idInc++;
  }
}

let entities: Entity[] = [];


function sk4Init(): IEzdSketch {
  return ezdSk.init(skId, (skEls: SkElems) => {
    let sk4p5 = new p5((p) => {
      let sketch_w = skEls.skEl.clientWidth;
      let sketch_h = skEls.skEl.clientHeight;
      let drawingCtx: CanvasRenderingContext2D;
      let cnvRenderer: p5.Renderer;
      let t: ReturnType<typeof initColors>;
      let mid_pt: Point = {
        x: Math.round(sketch_w/2),
        y: Math.round(sketch_h/2),
      };

      p.setup = setup;
      p.draw = draw;

      function draw() {
        p.background(t.bg);

        p.noFill()
        p.stroke(t.c2);
        p.line(0, sketch_h - 50, sketch_w, sketch_h - 50);
      }

      function setup() {
        t = initColors(p);
        cnvRenderer = p.createCanvas(sketch_w, sketch_h);
        drawingCtx = p.drawingContext as CanvasRenderingContext2D;
        p.textFont('IBM Plex Mono');
      }
    }, skEls.skEl);
    return sk4p5;

    function initColors(p: p5) {
        const t = {
          bg: p.color(20),
          txt1: p.color(240),
          c1: p.color(240),
          c2: p.color(210, 182, 140), // ground
        };
        return t;
      }
  });
}
