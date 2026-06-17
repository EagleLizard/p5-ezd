
import './main.css';
import p5 from 'p5';
import { Quad, QuadNode } from './lib/datastruct/quad';
import { geom, Point } from './lib/math/geom';

let cfg_base_elems: {
  cfgTmplt: HTMLTemplateElement;
  inputGroupBase: HTMLDivElement;
  numInputBase: HTMLDivElement;
  btnInputBase: HTMLDivElement;
};

let sk_list: IEzdSketch[] = [];
let curr_sk_idx = 0;

(() => {
  try {
    initTemplateElems();

    initSketches();
    initSketch3();
    init2();
    init1();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

type SkApp = {
  head: {
    el: HTMLDivElement;
    title: {
      el: HTMLDivElement;
      textEl: HTMLHeadingElement;
    }
    tools: {
      el: HTMLDivElement;
      prevBtn: BtnElem;
      nextBtn: BtnElem;
    }
  }
};

function initApp(): SkApp {
  let headEl = document.querySelector<HTMLDivElement>('#app-head')!;
  let toolbarEl = headEl.querySelector<HTMLDivElement>('.toolbar')!;
  let titleEl = headEl.querySelector<HTMLDivElement>('.title')!;
  let titleTextEl = titleEl.querySelector<HTMLHeadingElement>('.title-text')!;

  let prevBtn = createBtnInputElem('prev-sk-btn', { txt: 'prev', disabled: true });
  let nextBtn = createBtnInputElem('prev-sk-btn', { txt: 'next' });
  let inputGroup1 = createInputGroupElem({ children: [ prevBtn.el, nextBtn.el ]});
  toolbarEl.appendChild(inputGroup1.el);

  let skApp: SkApp = {
    head: {
      el: headEl,
      tools: {
        el: toolbarEl,
        prevBtn: prevBtn,
        nextBtn: nextBtn,
      },
      title: {
        el: titleEl,
        textEl: titleTextEl,
      },
    },
  };
  return skApp;
}

type IEzdSketch = {
  id: string;
  init: () => void;
  destroy: () => void;
};

function initSketches() {
  let skApp = initApp();

  let skc1 = initSketchC1();
  let skc2 = initSkC2();
  sk_list.push(skc1);
  sk_list.push(skc2);
  sk_init();

  /* -- init app functionality -- */
  skApp.head.tools.nextBtn.btnEl.addEventListener('click', ($e) => {
    set_sk(curr_sk_idx + 1);
  });
  skApp.head.tools.prevBtn.btnEl.addEventListener('click', ($e) => {
    set_sk(curr_sk_idx - 1);
  });
  function set_sk(sk_idx: number) {
    if(sk_idx === curr_sk_idx) {
      return;
    }
    if(sk_idx < 0 || sk_idx >= sk_list.length) {
      throw new Error(`Range error: invalid sk_idx: ${sk_idx}`);
    }
    /* delete current active sketch */
    sk_list[curr_sk_idx].destroy();
    curr_sk_idx = sk_idx;
    skApp.head.title.textEl.innerText = sk_list[curr_sk_idx].id;
    sk_init();
    if(curr_sk_idx > 0 && skApp.head.tools.prevBtn.btnEl.disabled) {
      skApp.head.tools.prevBtn.btnEl.disabled = false;
    }
    if(curr_sk_idx >= sk_list.length - 1 && !skApp.head.tools.prevBtn.btnEl.disabled) {
      skApp.head.tools.nextBtn.btnEl.disabled = true;
    }
    if(curr_sk_idx < sk_list.length - 1 && skApp.head.tools.nextBtn.btnEl.disabled) {
      skApp.head.tools.nextBtn.btnEl.disabled = false;
    }
    if(curr_sk_idx <= 0 && !skApp.head.tools.prevBtn.btnEl.disabled) {
      skApp.head.tools.prevBtn.btnEl.disabled = true;
    }
  }
  function sk_init(sk_idx: number = curr_sk_idx) {
    let sk = sk_list[sk_idx];
    skApp.head.title.textEl.innerText = sk.id;
    sk.init();
  }
}

function initSkC2(): IEzdSketch {
  const skId = 'sk-c2';
  let skElems: SkElems;
  let skp5: p5;
  let ezdSk: IEzdSketch;
  let _initialized = false;

  ezdSk = {
    id: skId,
    init: init,
    destroy: destroy,
  };
  return ezdSk;

  function init() {
    if(_initialized) {
      return;
    }
    initElems();
    initSkc2();
    _initialized = true;
  }
  function destroy() {
    skp5.remove();
    skElems.el.remove();
    _initialized = false;
  }
  function initElems() {
    skElems = createSketchElems('sk-c2');
    console.log(skElems);
  }
  function initSkc2() {
    skp5 = new p5((p) => {
      let drawingCtx: CanvasRenderingContext2D;
      let cnvRenderer: p5.Renderer;
      p.setup = function setup() {
        cnvRenderer = p.createCanvas(skElems.skEl.clientWidth, skElems.skEl.clientWidth);
        drawingCtx = p.drawingContext as CanvasRenderingContext2D;
        p.textFont('IBM Plex Mono', 12);
      }
      p.draw = function draw() {
        let textPad = 10;
        p.fill(255, 0, 0);
        p.text(skId, textPad, textPad + p.textSize());
      }
    }, skElems.skEl)
  }
}

function initSketchC1(): IEzdSketch {
  const skId = 'sk-c1';
  let skElems: SkElems;
  let skc1p5: p5;
  let initialized = false;

  return {
    id: skId,
    init: init,
    destroy: destroy,
  }
  function init() {
    if(initialized) {
      return;
    }
    initElems();
    initSkc1();
    initialized = true;
  }
  function destroy() {
    skc1p5.remove();
    skElems.el.remove();
    // console.log(skElems);
    initialized = false;
  }
  function initElems() {
    skElems = createSketchElems(skId);
    let resetBtn = createBtnInputElem('sk-c1_reset-btn', { txt: 'reset' });
    let deleteBtn = createBtnInputElem('sk-c1_delete-btn', { txt: 'del' });
    let inputGroup1 = createInputGroupElem({ children: [ resetBtn.el, deleteBtn.el ] });
    skElems.cfg.menuEl.appendChild(inputGroup1.el);

    /* -- Event Handlers -- */
    deleteBtn.btnEl.addEventListener('click', ($e) => {
      // console.log(skc1p5);
      destroy();
    });
  }
  function initSkc1() {
    skc1p5 = new p5((p) => {
      let sketch_w = skElems.skEl.clientWidth;
      let sketch_h = skElems.skEl.clientHeight;
      let drawingCtx: CanvasRenderingContext2D;
      let cnvRenderer: p5.Renderer;
      p.setup = function setup() {
        cnvRenderer = p.createCanvas(sketch_w, sketch_h);
        drawingCtx = p.drawingContext as CanvasRenderingContext2D;
        p.textFont('IBM Plex Mono', 12);
      }
      p.draw = function draw() {
        let txtPad = 15;
        p.text(skId, txtPad, txtPad + p.textSize());
      }
    }, skElems.skEl);
  }
}

class WthObj {
  static init_v = -7;
  static origin_y = 100;
  static bounce_mod = 0.6;
  static g = 0.25;

  y_max = WthObj.origin_y;
  y_min = 0;
  x = 0;
  y = 0;
  v = 0;
  active = false;
  txt: string;

  constructor(txt: string) {
    this.txt = txt;
  }
  /* advance by one step _*/
  step() {
    let bounce_mod = WthObj.bounce_mod;
    const g = WthObj.g;
    this.y += this.v;
    if(this.y > this.y_max) {
      this.v *= -bounce_mod;
      this.y = this.y_max;
      if(((this.v + g) * bounce_mod) - (this.v + g) < 0.25) {
        if(this.active) {
          this.v = WthObj.init_v;
        } else {
          this.v = 0;
        }
      }
    } else {
      this.v += g; // gravity
    }
  }
}

function initSketch3() {
  const sk3Id = 'sk-3';
  let skElems = createSketchElems(sk3Id);
  let sk3El = skElems.skEl;

  let resetBtn = createBtnInputElem('sk3_reset-btn', {
    txt: 'reset',
  });
  let inputGroup1 = createInputGroupElem({ children: [ resetBtn.el ] });
  skElems.cfg.menuEl.appendChild(inputGroup1.el)

  let sk_3 = new p5((p) => {
    let sketch_w = sk3El.clientWidth;
    let sketch_h = sk3El.clientHeight;
    let bgColor: p5.Color;
    let drawingCtx: CanvasRenderingContext2D;
    let cnvRenderer: p5.Renderer;

    let c1: p5.Color;

    let quadColors: p5.Color[];
    const quadPad = 25;
    let baseQuad: Quad;
    let qPts: Point[];

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

    function drawMouseEffects() {
      p.noFill();
      p.stroke(c1);

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
  }, sk3El);
}

type SkElems = {
  el: HTMLDivElement;
  rootEl: HTMLDivElement;
  skEl: HTMLDivElement;
  cfg: {
    el: HTMLDivElement;
    titleEl: HTMLDivElement;
    menuEl: HTMLDivElement;
  }
} & {};

function createSketchElems(skId: string): SkElems {
  let rootEl = document.querySelector<HTMLDivElement>('#p5-ezd-app');
  if(rootEl === null) {
    throw new Error('root element is null');
  }
  let skMainEl = rootEl.querySelector<HTMLDivElement>('#sketch-main');
  if(skMainEl === null) {
    throw new Error('sketch-main element is null');
  }
  let sketchAppTmplt = getHtmlTemplate('#sketch-app-tmplt');
  let sketchAppEl = document.importNode(sketchAppTmplt.content, true)
    .querySelector<HTMLDivElement>('.sk-app')!;
  sketchAppEl.id = `${skId}-app`;
  skMainEl.appendChild(sketchAppEl);
  /* init dom/menu */
  let skRootEl = sketchAppEl.querySelector<HTMLDivElement>('.sk-root');
  if(skRootEl === null) {
    throw new Error('missing sketch root element');
  }
  let skRootId = `${skId}-root`;
  skRootEl.id = skRootId;

  let skEl = skRootEl.querySelector<HTMLDivElement>('.sketch');
  if(skEl === null) {
    throw new Error('missing sketch container element');
  }
  // let skEl = document.createElement('div');
  skEl.id = skId;
  /* init config panel */
  let cfgPanelEl = sketchAppEl.querySelector<HTMLDivElement>('.sk-cfg-panel');
  if(cfgPanelEl === null) {
    throw new Error('null config panel elem');
  }
  let cfgTitleEl = cfgPanelEl.querySelector<HTMLDivElement>('.sk-cfg-title');
  if(cfgTitleEl === null) {
    throw new Error('null config title elem');
  }
  let cfgMenuEl = cfgPanelEl.querySelector<HTMLDivElement>('.sk-cfg-menu');
  if(cfgMenuEl === null) {
    throw new Error('null config menu elem');
  }
  return {
    el: sketchAppEl,
    skEl: skEl,
    rootEl: skRootEl,
    cfg: {
      el: cfgPanelEl,
      titleEl: cfgTitleEl,
      menuEl: cfgMenuEl,
    },
  }
}

function initTemplateElems() {
  let cfgTmpltEl = getHtmlTemplate('#sk-cfg-components-tmplt');
  cfg_base_elems = {
    cfgTmplt: cfgTmpltEl,
    inputGroupBase: document.importNode(cfgTmpltEl.content, true)
      .querySelector<HTMLDivElement>('.cfg-input-group')!,
    numInputBase: document.importNode(cfgTmpltEl.content, true)
      .querySelector<HTMLDivElement>('.num-input')!,
    btnInputBase: document.importNode(cfgTmpltEl.content, true)
      .querySelector<HTMLDivElement>('.cfg-input.btn-input')!,
  };
}

type NumInputElem = {
  el: HTMLDivElement;
  inputEl: HTMLInputElement;
  labelEl: HTMLDivElement;
};
function createNumInputElem(elId: string, opts: {
  value?: string | number;
  step?: string | number;
  labelTxt?: string;
} = {}): NumInputElem {
  let numEl = cfg_base_elems.numInputBase.cloneNode(true) as HTMLDivElement;
  let numInputEl = numEl.querySelector<HTMLInputElement>('input[type="number"]')!;
  numInputEl.id = elId;
  if(opts.value !== undefined) {
    numInputEl.value = `${opts.value}`;
  }
  if(opts.step !== undefined) {
    numInputEl.step = `${opts.step}`;
  }
  let numLabelEl = numEl.querySelector<HTMLDivElement>('.number-label')!;
  if(opts.labelTxt !== undefined) {
    numLabelEl.innerText = opts.labelTxt;
  }
  return {
    el: numEl,
    inputEl: numInputEl,
    labelEl: numLabelEl,
  };
}
type BtnElem = {
  el: HTMLDivElement;
  btnEl: HTMLButtonElement;
  labelEl: HTMLDivElement;
};
function createBtnInputElem(elId: string, opts: {
  txt?: string;
  labelTxt?: string;
  disabled?: boolean;
} = {}): BtnElem {
  let btnEl = cfg_base_elems.btnInputBase.cloneNode(true) as HTMLDivElement;
  let btnInputEl = btnEl.querySelector<HTMLButtonElement>('button.sk-btn')!;
  let btnLabelEl = btnEl.querySelector<HTMLDivElement>('.sk-btn-label')!;
  btnInputEl.id = elId;
  if(opts.txt !== undefined) {
    btnInputEl.innerText = opts.txt;
  }
  if(opts.disabled !== undefined) {
    btnInputEl.disabled = opts.disabled;
  }
  if(opts.labelTxt !== undefined) {
    btnLabelEl.innerText = opts.labelTxt;
  }
  return {
    el: btnEl,
    btnEl: btnInputEl,
    labelEl: btnLabelEl,
  };
}
type InputGroupElem = {
  el: HTMLDivElement;
};
function createInputGroupElem(opts: {
  elId?: string;
  children?: HTMLElement[];
} = {}): InputGroupElem {
  let inputGroupElem = cfg_base_elems.inputGroupBase.cloneNode(true) as HTMLDivElement;
  let children = opts.children ?? [];
  if(opts.elId !== undefined) {
    inputGroupElem.id = opts.elId;
  }
  for(let i = 0; i < children.length; i++) {
    inputGroupElem.appendChild(children[i]);
  }
  return {
    el: inputGroupElem,
  };
}

function init2() {
  /* sketch-specific */
  initSketchB();
}

function initSketchB() {

  /* init menu/dom _*/
  const sk_b_id = 'sketch-b';
  let skElems = createSketchElems(sk_b_id);
  let skBEl = skElems.skEl;
  const cfg_default = {
    circ_d: 100,
    rot_mod: 2,
    freq_mod: 3,
  };
  let cfg = Object.assign({}, cfg_default);

  let resetBtn = createBtnInputElem('skB_reset-btn', {
    txt: 'reset',
  });
  let inputGroup1 = createInputGroupElem({ children: [ resetBtn.el ] });

  let freqInput = createNumInputElem('skB_freq-mod-input', {
    value: cfg.freq_mod,
    step: 0.25,
    labelTxt: 'freq',
  });
  let rotInput = createNumInputElem('skB_rot-mod-input', {
    value: cfg.rot_mod,
    step: 0.5,
    labelTxt: 'rot',
  });
  let inputGroup2 = createInputGroupElem({ children: [
    freqInput.el,
    rotInput.el,
  ]});

  skElems.cfg.menuEl.appendChild(inputGroup1.el);
  skElems.cfg.menuEl.appendChild(inputGroup2.el);


  let sketch_b = new p5((p) => {
    let bg_color: p5.Color;
    let sketch_w = skBEl.clientWidth;
    let sketch_h = skBEl.clientHeight;
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

      let [ circ_x2, circ_y2 ] = geom.endPoint(circX, circY, r, cDeg);
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
  }, skBEl);
}

function init1() {
  let skElems = createSketchElems('sketch-a');
  let skAEl = skElems.skEl;

  let activeBtn = createBtnInputElem('sk-a_active-toggle-btn', {
    txt: 'stop'
  });
  let resetBtn = createBtnInputElem('sk-a_reset-btn', {
    txt: 'reset',
    disabled: true,
  });
  let inputGroup1 = createInputGroupElem({
    children: [ activeBtn.el, resetBtn.el ],
  });

  let bounceInput = createNumInputElem('sk-a_bounce', {
    labelTxt: 'bounce',
    step: 0.05,
  });
  let gInput = createNumInputElem('sk-a_g-input', {
    labelTxt: 'g',
    step: 0.01,
  });
  let inputGroup2 = createInputGroupElem({
    children: [ bounceInput.el, gInput.el ],
  });

  skElems.cfg.menuEl.appendChild(inputGroup1.el);
  skElems.cfg.menuEl.appendChild(inputGroup2.el);

  let sketch_a = new p5((p: p5) => {
    let bg_color: p5.Color;
    let sketch_w = skAEl.clientWidth;
    let sketch_h = skAEl.clientHeight;
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
  }, skAEl);
}

function getHtmlTemplate(qs: string) {
  let templateEl = document.querySelector<HTMLTemplateElement>(qs);
  if(templateEl === null) {
    throw new Error(`null template '${qs}'`);
  }
  return templateEl;
}
