import { createElement } from "../utils/index.js";
import {
  AFTER,
  BEFORE,
  DATA_UI_PREFIX,
  FOCUS,
  FOCUSABLE_ELEMENTS_SELECTOR,
  TABINDEX,
} from "../constants/index.js";

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
      let returnElem = opts.returnElem;
      let focusFirst = false;
      if (e.relatedTarget === returnElem) {
        returnElem = false;
        focusFirst = true;
      }
      if (!returnElem) {
        const returnElems = target.querySelectorAll(
          FOCUSABLE_ELEMENTS_SELECTOR,
        );
        if (
          !focusFirst &&
          e.target.getAttribute(DATA_UI_PREFIX + FOCUS_GUARD) === BEFORE
        ) {
          returnElem = returnElems[returnElems.length - 1];
        } else {
          returnElem = returnElems[0];
        }
      }
      returnElem?.focus();
    };

    this.focusGuards = [BEFORE, AFTER].map((methodName) => {
      const focusGuard = createElement("span", {
        [TABINDEX]: 0,
        [DATA_UI_PREFIX + FOCUS_GUARD]: methodName,
        style: "outline:none;opacity:0;position:fixed;pointer-events:none;",
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

// export default function (elem) {
//   return [BEFORE, AFTER].map((methodName) => {
//     const focusGuard = createElement("span", {
//       [TABINDEX]: 0,
//       [DATA_UI_PREFIX + "focus-guard"]: "",
//       style: "outline:none;opacity:0;position:fixed;pointer-events:none;",
//     });
//     elem[methodName](focusGuard);
//     return focusGuard;
//   });
// }
