
import p5 from 'p5';
import { ezdElems } from '../../app/ezd-elems';
import { ezdSk, IEzdSketch } from '../../app/ezd-sk';
import { WthObj } from './wth';

const skId = 'sketch-a';

export const skA = {
  id: skId,
  init: initSketchA,
};

function initSketchA(): IEzdSketch {
  return ezdSk.init(skId, (skElems) => {
    let activeBtn = ezdElems.createBtnInputElem('sk-a_active-toggle-btn', {
      txt: 'stop',
    });
    let resetBtn = ezdElems.createBtnInputElem('sk-a_reset-btn', {
      txt: 'reset',
      disabled: true,
    });
    let inputGroup1 = ezdElems.createInputGroupElem({
      children: [ activeBtn.el, resetBtn.el ],
    });

    let bounceInput = ezdElems.createNumInputElem('sk-a_bounce', {
      labelTxt: 'bounce',
      step: 0.05,
    });
    let gInput = ezdElems.createNumInputElem('sk-a_g-input', {
      labelTxt: 'g',
      step: 0.01,
    });
    let inputGroup2 = ezdElems.createInputGroupElem({
      children: [ bounceInput.el, gInput.el ],
    });

    skElems.cfg.menuEl.appendChild(inputGroup1.el);
    skElems.cfg.menuEl.appendChild(inputGroup2.el);

    return new p5((p) => {
      let bg_color: p5.Color;
      let sketch_w = skElems.skEl.clientWidth;
      let sketch_h = skElems.skEl.clientHeight;
      let wthObjs: WthObj[] = [];

      let wthActive = true;

      p.setup = function setup() {
      /* constant/global vars _*/
        bg_color = p.color(255, 255, 255);

        initWthText();

        p.createCanvas(sketch_w, sketch_h);
      }
      p.draw = function draw() {
        // p.background(100, 100, 100);
        p.background(bg_color);
        // p.circle(p.mouseX, p.mouseY, 20);
        updateCfgPanel();
        drawWthText();
        drawInfo();
      }

      function initWthText() {
        // [ 'what', 'the', 'heck' ].forEach((str) => {
        'what the heck. omg. wow. wtf, ok ~ lol'.split('').forEach((str) => {
          let wthObj = new WthObj(str);
          // wthObj.v = WthObj.init_v;
          wthObj.y = WthObj.origin_y;
          wthObjs.push(wthObj);
        });

        /* === init DOM stuff === _*/
        bounceInput.inputEl.value = `${WthObj.bounce_mod}`;
        gInput.inputEl.value = `${WthObj.g}`;

        activeBtn.btnEl.addEventListener('click', ($e) => {
          wthActive = !wthActive;
          if(!wthActive) {
            wthObjs.forEach(wthObj => {
              wthObj.active = false;
            });
          }
          resetBtn.btnEl.disabled = wthActive;
        });
        resetBtn.btnEl.addEventListener('click', ($e) => {
          wthObjs.forEach(wthObj => {
            wthObj.v = 0;
            wthObj.y = WthObj.origin_y;
          });
        });
      }
      /*
      Bouncy text. animation
      _*/
      function drawWthText() {
        let origin_x = 50;
        let origin_y = WthObj.origin_y;
        let pos_x = 0;
        let pos_y = 0;
        let fcMod = p.frameCount % 10;
        let spaceW = p.textWidth('_');
        p.textFont('IBM Plex Mono');
        p.textSize(16);
        p.fill(127, 120, 50);
        wthObjs.some(wthObj => {
          if(wthObj.active !== wthActive && fcMod === 0) {
            wthObj.active = wthActive;
            return true;
          }
        });
        wthObjs.forEach(wthObj => {
          wthObj.step()
        });
        wthObjs.forEach(wthObj => {
          let strW = (wthObj.txt === ' ') ? spaceW : p.textWidth(wthObj.txt);
          let strX = origin_x + pos_x + wthObj.x;
          let strY = origin_y + pos_y + wthObj.y;
          p.text(wthObj.txt, strX, strY);
          pos_x += strW + 3;
        });
      }

      function drawInfo() {
        let fcStr = `fc: ${p.frameCount.toLocaleString()}`;
        p.textSize(12);
        p.fill(0);
        p.text(fcStr, 10, sketch_h - p.textBounds(fcStr, 0,0).h);
      }

      function updateCfgPanel() {
        let nextBtnLabelTxt: string | undefined;
        let nextBtnIsActive = resetBtn.btnEl.dataset?.active === 'true';
        if(nextBtnIsActive !== wthActive) {
          resetBtn.btnEl.dataset.active = wthActive === true ? 'true' : 'false';
        }
        nextBtnLabelTxt = wthActive ? 'stop' : 'start';
        if(activeBtn.btnEl.innerText !== nextBtnLabelTxt) {
          activeBtn.btnEl.innerText = nextBtnLabelTxt;
        }

        /* bounce _*/
        let currBounceElVal = +bounceInput.inputEl.value.trim();
        if(currBounceElVal !== WthObj.bounce_mod) {
          if(!isNaN(currBounceElVal)) {
            WthObj.bounce_mod = currBounceElVal;
          }
        }
        /* g (gravity) _*/
        let currGElVal = +gInput.inputEl.value.trim();
        if(!isNaN(currGElVal) && currGElVal !== WthObj.g) {
          WthObj.g = currGElVal;
        }
      }
    }, skElems.skEl);
  });
}