import {
  FOCUSABLE_ELEMENTS_SELECTOR,
  doc,
  OPTION_PREVENT_SCROLL,
  TABINDEX,
} from "../constants";
import { getOptionElem } from "../utils/index.js";

export default (instance, elem = instance.base) => {
  const autofocus = instance.opts.autofocus;
  if (elem.contains(doc.activeElement)) return;
  let focusElem = getOptionElem(instance, autofocus.elem, elem);
  const isDialog = elem.tagName === "DIALOG";
  console.log("s");
  if (!focusElem && instance.opts.focusTrap && !isDialog) {
    focusElem = elem.querySelector(FOCUSABLE_ELEMENTS_SELECTOR);
    if (!focusElem && elem.hasAttribute(TABINDEX)) {
      focusElem = elem;
    }
  }
  focusElem?.focus({
    [OPTION_PREVENT_SCROLL]: autofocus[OPTION_PREVENT_SCROLL] ?? false,
  });
};
