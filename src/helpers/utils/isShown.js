import {
  ACTION_REMOVE,
  CLASS_HIDDEN_MODE,
  CLASS_SHOWN_MODE,
  HIDDEN,
  HIDDEN_CLASS,
  MODE_HIDDEN_UNTIL_FOUND,
  SHOWN_CLASS,
} from "../constants/index.js";
import { inDOM } from "../dom/index.js";

export default (elem, stateMode) => {
  return stateMode === ACTION_REMOVE
    ? inDOM(elem)
    : stateMode === CLASS_HIDDEN_MODE
    ? !elem.classList.contains(HIDDEN_CLASS)
    : stateMode === CLASS_SHOWN_MODE
    ? elem.classList.contains(SHOWN_CLASS)
    : !elem.hasAttribute(
        stateMode === MODE_HIDDEN_UNTIL_FOUND ? HIDDEN : stateMode,
      );
};
