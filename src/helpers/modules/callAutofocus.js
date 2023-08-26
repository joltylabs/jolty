import {
  FOCUSABLE_ELEMENTS_SELECTOR,
  doc,
  OPTION_PREVENT_SCROLL,
} from "../constants";
import { getOptionElem } from "../utils/index.js";
import { isDialog } from "../is/index.js";

export default (instance, elem = instance.base) => {
  const autofocus = instance.opts.autofocus;
  if (elem.contains(doc.activeElement)) return;
  let focusElem = getOptionElem(instance, autofocus.elem, elem);
  if (!focusElem && instance.opts.focusTrap && !isDialog(elem)) {
    focusElem = elem.querySelector(FOCUSABLE_ELEMENTS_SELECTOR) ?? elem;
  }
  focusElem?.focus({
    [OPTION_PREVENT_SCROLL]: autofocus[OPTION_PREVENT_SCROLL] ?? false,
  });
};
