
import './main.css';
import { BtnElem, ezdElems } from './app/ezd-elems';
import { skB, skA, sk3, sk4, } from './sketch';

let sk_list: IEzdSketch[] = [];
let curr_sk_idx = 0;

(() => {
  try {
    initSketches();
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
    skSelect: {
      el: HTMLDivElement,
    }
  }
};

function initApp(): SkApp {
  let headEl = document.querySelector<HTMLDivElement>('#app-head')!;
  let toolbarEl = headEl.querySelector<HTMLDivElement>('.toolbar')!;
  let titleEl = headEl.querySelector<HTMLDivElement>('.title')!;
  let skSelectEl = headEl.querySelector<HTMLDivElement>('.sk-select')!;
  let titleTextEl = titleEl.querySelector<HTMLHeadingElement>('.title-text')!;

  let prevBtn = ezdElems.createBtnInputElem('prev-sk-btn', { txt: 'prev', disabled: true });
  let nextBtn = ezdElems.createBtnInputElem('prev-sk-btn', { txt: 'next' });
  let inputGroup1 = ezdElems.createInputGroupElem({ children: [ prevBtn.el, nextBtn.el ]});
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
      skSelect: {
        el: skSelectEl,
      }
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
  sk_list.push(sk4.init());
  sk_list.push(sk3.init());
  sk_list.push(skB.init());
  sk_list.push(skA.init());

  let skBtns: {
    skId: string;
    btn: BtnElem;
  }[] = [];
  sk_list.forEach(sk => {
    let btnElem = ezdElems.createBtnInputElem(`sk-select-menu-btn_${sk.id}`, {
      txt: sk.id,
    });
    skBtns.push({
      skId: sk.id,
      btn: btnElem,
    });
  });
  let skSelectInputGroup = ezdElems.createInputGroupElem({
    children: skBtns.map(skBtn => skBtn.btn.el),
  });
  skApp.head.skSelect.el.appendChild(skSelectInputGroup.el);

  sk_init();

  /* -- init app functionality -- */
  skApp.head.tools.nextBtn.btnEl.addEventListener('click', ($e) => {
    set_sk(curr_sk_idx + 1);
  });
  skApp.head.tools.prevBtn.btnEl.addEventListener('click', ($e) => {
    set_sk(curr_sk_idx - 1);
  });
  skBtns.forEach(skBtn => {
    skBtn.btn.btnEl.addEventListener('click', ($e) => {
      let skIdx = sk_list.findIndex(sk => sk.id === skBtn.skId);
      if(skIdx !== -1) {
        set_sk(skIdx);
      }
    });
  });

  /* --- util functions --- */
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
    for(let i = 0; i < skBtns.length; i++) {
      let skBtn = skBtns[i];
      if(skBtn.skId === sk.id && !skBtn.btn.btnEl.disabled) {
        skBtn.btn.btnEl.disabled = true;
      } else if(skBtn.skId !== sk.id && skBtn.btn.btnEl.disabled) {
        skBtn.btn.btnEl.disabled = false;
      }
    }
  }
}
