import { doc, OPTION_PREVENT_SCROLL, TABINDEX } from "../constants";
import { getOptionElem } from "../utils/index.js";
const FOCUSABLE_ELEMENTS_SELECTOR = `:is(:is(a,area)[href],:is(select,textarea,button,input:not([type="hidden"])):not(disabled),details:not(:has(>summary)),iframe,:is(audio,video)[controls],[contenteditable],[tabindex]):not([inert],[inert] *,[tabindex^="-"])`;
export default (instance, elem = instance.base) => {
  const autofocus = instance.opts.autofocus;
  if (elem.contains(doc.activeElement)) return;
  let focusElem = getOptionElem(instance, autofocus.elem, elem);
  const isDialog = elem.tagName === "DIALOG";
  if ((!focusElem && autofocus.required && !isDialog) || isDialog) {
    focusElem = elem.querySelector(FOCUSABLE_ELEMENTS_SELECTOR);
    if (!focusElem && elem.hasAttribute(TABINDEX)) {
      focusElem = elem;
    }
  }

  focusElem?.focus({
    [OPTION_PREVENT_SCROLL]: autofocus[OPTION_PREVENT_SCROLL] ?? false,
  });
};
