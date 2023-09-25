import {
  ACTION_REMOVE,
  CLASS_HIDDEN_MODE,
  CLASS_SHOWN_MODE,
  HIDDEN_CLASS,
  SHOWN_CLASS,
} from "../constants/index.js";
import { inDOM } from "../dom/index.js";

export default (elem, hideMode) => {
  return hideMode === ACTION_REMOVE
    ? inDOM(elem)
    : hideMode === CLASS_HIDDEN_MODE
    ? !elem.classList.contains(HIDDEN_CLASS)
    : hideMode === CLASS_SHOWN_MODE
    ? elem.classList.contains(SHOWN_CLASS)
    : !elem.hasAttribute(hideMode);
};
