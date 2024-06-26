import {
  FOCUSABLE_ELEMENTS_SELECTOR,
  AUTOFOCUS,
  DATA_UI_PREFIX,
} from "../constants";
import { getOptionElem } from "../utils/index.js";
import { isDialog } from "../is/index.js";
import { focus } from "../dom/index.js";

export default (instance, elem = instance.base) => {
  const autofocus = instance.opts.autofocus;
  let focusElem = getOptionElem(
    instance,
    autofocus === true
      ? `[${AUTOFOCUS}],[${DATA_UI_PREFIX + AUTOFOCUS}=""],[${
          DATA_UI_PREFIX + AUTOFOCUS
        }="${instance.constructor.NAME}"]`
      : autofocus,
    elem,
  );

  focusElem ||= elem.contains(document.activeElement) && document.activeElement;

  if (!focusElem && !isDialog(elem)) {
    focusElem = elem.querySelector(FOCUSABLE_ELEMENTS_SELECTOR) ?? elem;
  }

  focus(focusElem);
};
