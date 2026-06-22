
import p5 from 'p5';
import { ezdSk } from '../../app/ezd-sk';
import { ezdElems } from '../../app/ezd-elems';
import { Quad, QuadNode } from '../../lib/datastruct/quad';
import { geom, Point } from '../../lib/math/geom';


const skId = 'sk-3';

export const sk3 = {
  id: skId,
  init: sketch3Init,
};

function sketch3Init() {
  return ezdSk.init(skId, (skElems) => {
    let resetBtn = ezdElems.createBtnInputElem('sk3_reset-btn', {
      txt: 'reset',
    });
    let inputGroup1 = ezdElems.createInputGroupElem({ children: [ resetBtn.el ] });

    let balanceBtn = ezdElems.createBtnInputElem('sk3_balance-btn', {
      txt: 'balance',
    })
    let inputGroup2 = ezdElems.createInputGroupElem({ children: [ balanceBtn.el ] });

    skElems.cfg.menuEl.appendChild(inputGroup1.el);
    skElems.cfg.menuEl.appendChild(inputGroup2.el);

    return new p5((p) => {
      let sketch_w = skElems.skEl.clientWidth;
      let sketch_h = skElems.skEl.clientHeight;
      let bgColor: p5.Color;
      let drawingCtx: CanvasRenderingContext2D;
      let cnvRenderer: p5.Renderer;

      let c1: p5.Color;

      let quadColors: p5.Color[];
      const quadPad = 25;
      let baseQuad: Quad;
      let qPts: Point[];
      let minMsPt: Point | undefined;
      let mouseQuad: Quad | undefined;

      p.setup = function setup() {
        bgColor = p.color(255);
        c1 = p.color(10, 150, 100);
        quadColors = [
          c1,
          p.color(200, 0, 0),
          // p.color(120, 160, 0),
          p.color(0, 120, 160),
          p.color(140, 0, 140),
        ];

        cnvRenderer = p.createCanvas(sketch_w, sketch_h);
        drawingCtx = p.drawingContext as CanvasRenderingContext2D;

        initCfgMenu();

        let tl: Point = {
          x: quadPad,
          y: quadPad,
        };
        let br: Point = {
          x: sketch_w - quadPad,
          y: sketch_h - quadPad,
        }
        baseQuad = new Quad(tl, br);
        qPts = getInitPts();
        for(let i = 0; i < qPts.length; i++) {
          let pt = qPts[i];
          let qNode = new QuadNode(pt, i);
          baseQuad.insert(qNode);
        }
      }
      function getInitPts(): Point[] {
        let orig_x = baseQuad.tl.x;
        let orig_y = baseQuad.tl.y;
        let qw = baseQuad.w();
        let qh = baseQuad.h();
        let mid_x = baseQuad.br.x - (baseQuad.w() / 2);
        let mid_y = baseQuad.br.y - (baseQuad.h() / 2);
        let pts: Point[] = [
          { x: mid_x + 15, y: mid_y + 10  },
          { x: orig_x + (mid_x - orig_x)/2 + 10, y: orig_y + (mid_y - orig_y)/2 + 10},
          { x: orig_x + (mid_x - orig_x)/4 + 10, y: orig_y + (mid_y - orig_y)/4 + 10 },
          { x: orig_x + (mid_x - orig_x)/8 + 10, y: orig_y + (mid_y - orig_y)/8 + 8 },
          { x: orig_x + (mid_x - orig_x)/16 + 5, y: orig_y + (mid_y - orig_y)/16 + 3 },
          { x: mid_x + qw/4 - 10, y: orig_y + qh/4 - 10 },
          { x: mid_x + qw/8 - 10, y: mid_y - qh/8 - 10 },
          { x: mid_x + qw/16 - 10, y: mid_y - qh/16 - 7 },
          { x: mid_x + qw/16 + 10, y: mid_y - qh/16 - 7 },
          // { x: mid_x + qw/16 + (qw/32) + 5, y: mid_y - (qh/16 + qh/32) - 3 },
          // { x: mid_x + qw/16 - 10, y: mid_y - qh/16 + 7 },
          // { x: mid_x + qw/32 - 3, y: mid_y - qh/32 + 5 },
          // { x: mid_x + qw/8 + 10, y: mid_y - qh/8 - 7 },
        ];
        return pts;
      }

      p.draw = function draw() {
        p.background(bgColor);
        // p.fill(c1);
        p.stroke(c1);
        drawQuads2();
        drawMouseEffects();
      }
      p.mouseClicked = function handleMouseClick($e: MouseEvent) {
        let boundRect = cnvRenderer.elt.getBoundingClientRect();
        if(
          $e.x < boundRect.left
          || $e.x > boundRect.right
          || $e.y < boundRect.top
          || $e.y > boundRect.bottom
        ) {
          // do nothing;
          return;
        }
        let pt: Point = {
          x: Math.round($e.x - boundRect.left),
          y: Math.round($e.y - boundRect.top)
        };
        if(baseQuad.inBound(pt)) {
          let qn = new QuadNode(pt, qPts.length);
          baseQuad.insert(qn);
          qPts.push(qn.pos);
        }
        calcMouseEffects();
      }
      p.mouseMoved = function mouseMoved($e) {
        calcMouseEffects();
      }
      function calcMouseEffects() {
        let pts = baseQuad.getPoints();
        let msPt: Point = { x: p.mouseX, y: p.mouseY };
        let minDist = Infinity;
        let minPt: Point | undefined;
        for(let i = 0; i < pts.length; i++) {
          let pd = geom.dist(msPt, pts[i], { rel: true });
          if(pd < minDist) {
            minDist = pd;
            minPt = pts[i];
          }
        }
        if(minPt === undefined) {
          throw new Error('no point of any distance found');
        }
        // console.log(minPt);
        // p.line(msPt.x, msPt.y, minPt.x, minPt.y);
        minMsPt = minPt;
        /* find closest in quad */
        if(baseQuad.inBound(msPt)) {
          mouseQuad = baseQuad.getMinQuad({x: p.mouseX, y: p.mouseY});
        } else {
          mouseQuad = undefined;
        }
      }
      function drawMouseEffects() {
        p.noFill();
        p.stroke(c1);
        // p.strokeWeight(2);
        if(minMsPt !== undefined) {
          // console.log(minMsPt);
          let mptDist = geom.dist({x:p.mouseX, y:p.mouseY}, minMsPt);
          if(mptDist < 100) {
            p.line(p.mouseX, p.mouseY, minMsPt.x, minMsPt.y);
          }
        }

        // console.log(minQuad);
        if(mouseQuad?.n !== undefined) {
          // p.line(p.mouseX, p.mouseY, mouseQuad.n.pos.x, mouseQuad.n.pos.y);
        }
      }

      function initCfgMenu() {
        resetBtn.el.addEventListener('click', ($e) => {
          baseQuad = new Quad(baseQuad.tl, baseQuad.br);
          qPts = getInitPts();
          for(let i = 0; i < qPts.length; i++) {
            let qNode = new QuadNode(qPts[i], i);
            baseQuad.insert(qNode);
          }
        });
      }

      function drawQuads2() {
        _drawQuads(baseQuad);
        function _drawQuads(quad: Quad, depth = 0) {
          // drawQuad(quad, depth);
          let childQuads = [
            quad.nw,
            quad.ne,
            quad.sw,
            quad.se
          ];
          for(let i = 0; i < childQuads.length; i++) {
            let childQuad = childQuads[i];
            if(childQuad !== undefined) {
              _drawQuads(childQuad, depth + 1);
            }
          }
          drawQuad(quad, depth);
        }
      }

      function drawQuad(quad: Quad, depth = 0) {
        let depthMod = depth % quadColors.length;
        let qc1 = quadColors[depthMod];
        p.stroke(qc1);
        p.noFill();
        let midPt = quad.getMidPoint();

        if(quad === mouseQuad && quad.n !== undefined) {
          // p.rect(quad.n.pos.x - 5, quad.n.pos.y - 5, 10, 10)
          p.circle(quad.n.pos.x, quad.n.pos.y, 12);
        }

        if(quad.nw === undefined) {
          p.line(quad.tl.x, quad.tl.y, midPt.x, quad.tl.y);
          p.line(quad.tl.x, quad.tl.y, quad.tl.x, midPt.y);
        }
        if(quad.ne === undefined) {
          p.line(midPt.x, quad.tl.y, quad.br.x, quad.tl.y);
          p.line(quad.br.x, quad.tl.y, quad.br.x, midPt.y);
        }
        if(quad.sw === undefined) {
          p.line(midPt.x, quad.br.y, quad.tl.x, quad.br.y);
          p.line(quad.tl.x, quad.br.y, quad.tl.x, midPt.y);
        }
        if(quad.se === undefined) {
          p.line(midPt.x, quad.br.y, quad.br.x, quad.br.y);
          p.line(quad.br.x, quad.br.y, quad.br.x, midPt.y);
        }
        // p.rect(quad.tl.x, quad.tl.y, quad.w(), quad.h());

        drawingCtx.setLineDash([1, 2]);
        if(quad.nw === undefined && quad.ne === undefined) {
          p.line(midPt.x, quad.tl.y, midPt.x, midPt.y);
        }
        if(quad.ne === undefined && quad.se === undefined) {
          p.line(midPt.x, midPt.y, quad.br.x, midPt.y);
        }
        if(quad.sw === undefined && quad.se === undefined) {
          p.line(midPt.x, midPt.y, midPt.x, quad.br.y);
        }
        if(quad.nw === undefined && quad.sw === undefined) {
          p.line(midPt.x, midPt.y, quad.tl.x, midPt.y);
        }
        drawingCtx.setLineDash([]);
        let qn = quad.n;
        if(qn !== undefined) {
          p.circle(qn.pos.x, qn.pos.y, 3);
        }
      }
    }, skElems.skEl);
  });
}
