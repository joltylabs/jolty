import { arrayFrom, createElement } from "../utils/index.js";
import {
  AFTER,
  BEFORE,
  DATA_UI_PREFIX,
  doc,
  FIXED,
  FOCUS,
  FOCUSABLE_ELEMENTS_SELECTOR,
  TABINDEX,
} from "../constants/index.js";

import { focus } from "../dom/index.js";

const FOCUS_GUARD = FOCUS + "-guard";

export default class FocusGuards {
  constructor(target, opts = {}) {
    this.target = target;
    this.opts = opts;
    this.init();
  }
  init() {
    const { target, opts } = this;

    this.onFocus = (e) => {
      let returnElem = opts.anchor;
      let focusFirst = false;
      const isGuardBefore =
        e.target.getAttribute(DATA_UI_PREFIX + FOCUS_GUARD) === BEFORE;

      if (opts.focusAfterAnchor && returnElem) {
        if (!isGuardBefore) {
          const globalReturnElems = [
            ...doc.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
          ];
          returnElem =
            globalReturnElems[
              globalReturnElems.findIndex((el) => el === returnElem) + 1
            ];
        }
        opts.onFocusOut?.();
        return focus(returnElem);
      }

      if (e.relatedTarget === returnElem) {
        focusFirst = true;
      }

      arrayFrom(target.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR))
        .at(!focusFirst && isGuardBefore ? -1 : 0)
        .focus();
    };

    this.focusGuards = [BEFORE, AFTER].map((methodName) => {
      const focusGuard = createElement("span", {
        [TABINDEX]: 0,
        [DATA_UI_PREFIX + FOCUS_GUARD]: methodName,
        style: `outline:none;opacity:0;position:${
          opts.strategy ?? FIXED
        };pointer-events:none;`,
      });
      target[methodName](focusGuard);
      focusGuard.addEventListener(FOCUS, this.onFocus);
      return focusGuard;
    });
  }
  destroy() {
    this.focusGuards.forEach((focusGuard) => {
      focusGuard.remove();
      focusGuard.removeEventListener(FOCUS, this.onFocus);
    });
  }
}
