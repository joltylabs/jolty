import { doc, OPTION_PREVENT_SCROLL } from "../constants";
const FOCUSABLE_ELEMENTS_SELECTOR = `:is(:is(a,area)[href],:is(select,textarea,button,input:not([type="hidden"])):not(disabled),details:not(:has(>summary)),iframe,:is(audio,video)[controls],[contenteditable],[tabindex]):not([inert],[inert] *,[tabindex^="-"])`;
export default ({ opts: { autofocus }, getOptionElem, base }, elem = base) => {
  if (elem.contains(doc.activeElement)) return;
  let focusElem = getOptionElem(autofocus.elem, elem);
  const isDialog = elem.tagName === "DIALOG";
  if ((!focusElem && autofocus.required && !isDialog) || isDialog) {
    focusElem = getOptionElem(FOCUSABLE_ELEMENTS_SELECTOR, elem);
  }
  focusElem?.focus({
    [OPTION_PREVENT_SCROLL]: autofocus[OPTION_PREVENT_SCROLL] ?? false,
  });
};
