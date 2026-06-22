
let cfg_base_elems: {
  cfgTmplt: HTMLTemplateElement;
  inputGroupBase: HTMLDivElement;
  numInputBase: HTMLDivElement;
  btnInputBase: HTMLDivElement;
};

(() => {
  initTemplateElems();
})();

export const ezdElems = {
  getHtmlTemplate: getHtmlTemplate,
  createNumInputElem: createNumInputElem,
  createBtnInputElem: createBtnInputElem,
  createInputGroupElem: createInputGroupElem,
};

export type NumInputElem = {
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

export type BtnElem = {
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

export type InputGroupElem = {
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

function getHtmlTemplate(qs: string) {
  let templateEl = document.querySelector<HTMLTemplateElement>(qs);
  if(templateEl === null) {
    throw new Error(`null template '${qs}'`);
  }
  return templateEl;
}
