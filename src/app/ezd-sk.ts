
import p5 from 'p5'
import { ezdElems } from './ezd-elems';

export type IEzdSketch = {
  id: string;
  init: () => void;
  destroy: () => void;
};
export type SkElems = {
  el: HTMLDivElement;
  rootEl: HTMLDivElement;
  skEl: HTMLDivElement;
  cfg: {
    el: HTMLDivElement;
    titleEl: HTMLDivElement;
    menuEl: HTMLDivElement;
  }
} & {};

export const ezdSk = {
  init: initEzdSk,
};

function initEzdSk(skId: string, skFn: (skElems: SkElems) => p5): IEzdSketch {
  let skEls: SkElems;
  let skp5: p5;
  let _init = false;
  let ezdSk: IEzdSketch = {
    id: skId,
    init: init,
    destroy: destroy,
  };
  return ezdSk;

  function init() {
    if(_init) {
      return;
    }
    skEls = createSketchElems(skId);
    skp5 = skFn(skEls);
    _init = true;
  }
  function destroy() {
    skp5.remove();
    skEls.el.remove();
    _init = false;
  }
}

function createSketchElems(skId: string): SkElems {
  let rootEl = document.querySelector<HTMLDivElement>('#p5-ezd-app');
  if(rootEl === null) {
    throw new Error('root element is null');
  }
  let skMainEl = rootEl.querySelector<HTMLDivElement>('#sketch-main');
  if(skMainEl === null) {
    throw new Error('sketch-main element is null');
  }
  let sketchAppTmplt = ezdElems.getHtmlTemplate('#sketch-app-tmplt');
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
