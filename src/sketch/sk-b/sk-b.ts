
import p5 from 'p5';
import { ezdElems } from '../../app/ezd-elems';
import { ezdSk } from '../../app/ezd-sk';
import { geom } from '../../lib/math/geom';

const skId = 'sk-b';

export const skB = {
  id: skId,
  init: sketchBInit,
};

function sketchBInit() {
  return ezdSk.init(skId, (skElems) => {
    const cfg_default = {
      circ_d: 100,
      rot_mod: 2,
      freq_mod: 3,
    };
    let cfg = Object.assign({}, cfg_default);

    let resetBtn = ezdElems.createBtnInputElem('skB_reset-btn', {
      txt: 'reset',
    });
    let inputGroup1 = ezdElems.createInputGroupElem({ children: [ resetBtn.el ] });

    let freqInput = ezdElems.createNumInputElem('skB_freq-mod-input', {
      value: cfg.freq_mod,
      step: 0.25,
      labelTxt: 'freq',
    });
    let rotInput = ezdElems.createNumInputElem('skB_rot-mod-input', {
      value: cfg.rot_mod,
      step: 0.5,
      labelTxt: 'rot',
    });
    let inputGroup2 = ezdElems.createInputGroupElem({ children: [
      freqInput.el,
      rotInput.el,
    ]});

    skElems.cfg.menuEl.appendChild(inputGroup1.el);
    skElems.cfg.menuEl.appendChild(inputGroup2.el);
    return new p5((p) => {
      let bg_color: p5.Color;
      let sketch_w = skElems.skEl.clientWidth;
      let sketch_h = skElems.skEl.clientHeight;
      let drawingCtx: CanvasRenderingContext2D;

      let degIt = 0;

      p.setup = function setup() {
        bg_color = p.color(20);
        p.createCanvas(sketch_w, sketch_h);
        drawingCtx = p.drawingContext as CanvasRenderingContext2D;
        initCfgMenu();
      }

      p.draw = function draw() {
        p.background(bg_color);

        drawCircWav();
        drawInfoTxt();

        updateCfgMenu();
      }

      function initCfgMenu() {
        resetBtn.btnEl.addEventListener('click', ($e) => {
          cfg = Object.assign({}, cfg_default);
        });
        freqInput.inputEl.addEventListener('input', ($e) => {
          if(!($e.target instanceof HTMLInputElement)) {
            return;
          }
          let val = +$e.target.value;
          if(!isNaN(val)) {
            cfg.freq_mod = val;
          }
        });
        rotInput.inputEl.addEventListener('input', ($e) => {
          if(!($e.target instanceof HTMLInputElement)) {
            return;
          }
          let val = +$e.target.value;
          if(!isNaN(val)) {
            cfg.rot_mod = val;
          }
        });
      }

      function updateCfgMenu() {
        let currFreqMod = +freqInput.inputEl.value;
        if(currFreqMod !== cfg.freq_mod) {
          freqInput.inputEl.value = `${cfg.freq_mod}`;
        }
        let currRotMod = +rotInput.inputEl.value;
        if(currRotMod !== cfg.rot_mod) {
          rotInput.inputEl.value = `${cfg.rot_mod}`;
        }
      }

      function drawCircWav() {
        /* circ */
        let c1: p5.Color = p.color(10, 150, 230);
        // let c1: p5.Color = p.color(225, 195, 0);


        /* base / axes */
        // let c2 = p.color(150, 150, 150);
        let c2 = p.color(130);

        /* cosine */
        // let c5 = p.color(207, 221, 157);
        let c5 = p.color(251, 140, 172);
        // let c5 = p.color(253, 168, 191);
        // let c5 = p.color(253, 195, 209);

        // let c4 = p.color(225, 195, 0);
        // let c4 = p.color(215, 170, 170);
        // let c4 = p.color(239, 207, 227);
        let c4 = p.color(253, 168, 191);

        /* sine _*/
        // let c3 = p.color(215, 125, 95);
        // let c3 = p.color(0, 180, 150);
        let c3 = p.color(107, 241, 157);
        // let c3 = p.color(207, 221, 157);;
        // let c3 = p.color(239, 207, 227);
        // let c3 = p.color(248, 202, 228);

        let c6 = p.color(0, 220, 150);
        /* Position circle proportionally to one side _*/
        let cDeg = degIt % 360;
        degIt += cfg.rot_mod;
        let r = cfg.circ_d / 2;
        // let circX = sketch_w / 5;
        let circX = (cfg.circ_d - r) + 40;
        let circY = sketch_h / 2;
        let wavGraph_x = circX + r + 30;
        let wavGraph_w = (sketch_w - wavGraph_x - 30);
        p.strokeWeight(1);
        p.noFill();
        // p.stroke(15, 90, 75)
        p.stroke(c1);
        drawingCtx.setLineDash([4, 4]);
        p.circle(circX, circY, cfg.circ_d);
        drawingCtx.setLineDash([]);
        p.line(circX, circY - r, circX, circY + r);
        p.line(circX - r, circY, circX + r, circY);
        let circ_pt2 = geom.endPoint(circX, circY, r, cDeg);
        let circ_x2 = circ_pt2.x;
        let circ_y2 = circ_pt2.y
        // let [ circ_x2, circ_y2 ] = geom.endPoint(circX, circY, r, cDeg);
        p.stroke(c6);
        p.fill(c6);
        p.line(circX, circY, circ_x2, circ_y2);
        p.circle(circ_x2, circ_y2, 3);

        /* line to wave graph x-axis _*/
        p.stroke(c2);
        p.line(Math.max(circX, circ_x2), circ_y2, wavGraph_x, circ_y2);
        /* wave graph axes _*/
        p.line(wavGraph_x, circY - r, wavGraph_x, circY + r);
        drawingCtx.setLineDash([1, 2]);
        p.line(wavGraph_x, circY, wavGraph_x + wavGraph_w, circY);
        drawingCtx.setLineDash([]);

        p.stroke(c6);
        p.fill(c6);
        p.line(circ_x2, circ_y2, circX, circ_y2);
        p.circle(circX, circ_y2, 3);

        let cos_line_y = circY + (circ_x2 - circX);

        /* line to wave graph x-axis _*/
        p.stroke(c2);
        p.line(Math.max(circX,circ_x2), cos_line_y, wavGraph_x, cos_line_y);

        p.stroke(c4);
        p.fill(c4);
        p.circle(circ_x2, circY, 3);

        p.line(circ_x2, circY, circ_x2, cos_line_y);

        p.circle(circ_x2, cos_line_y, 3);

        p.line(circ_x2, cos_line_y, circX, cos_line_y)


        p.stroke(c5);
        p.fill(c5);
        p.circle(wavGraph_x, cos_line_y, 3);

        p.stroke(c3);
        p.fill(c3);
        p.circle(wavGraph_x, circ_y2, 3);
        let prev_x_sin: number | undefined;
        let prev_y_sin: number | undefined;
        let prev_x_cos: number | undefined;
        let prev_y_cos: number | undefined;
        for(let i = 0; i < wavGraph_w; i++) {
          let ix = i + wavGraph_x;
          let itheta = (cDeg - i*cfg.freq_mod) * (Math.PI / 180);
          let sinWavY = circY + (r*Math.sin(itheta));
          let cosWavY = circY + (r*Math.cos(itheta));
          if(prev_x_cos !== undefined && prev_y_cos !== undefined) {
            p.stroke(c5);
            p.line(prev_x_cos, prev_y_cos, ix, cosWavY);
          }
          prev_x_cos = ix;
          prev_y_cos = cosWavY;
          if(prev_x_sin !== undefined && prev_y_sin !== undefined) {
            p.stroke(c3);
            p.line(prev_x_sin, prev_y_sin, ix, sinWavY);
          }
          prev_x_sin = ix;
          prev_y_sin = sinWavY;
        }
      }

      function drawInfoTxt() {
        //
      }
    }, skElems.skEl);
  });
}
