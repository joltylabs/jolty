import { ACTION_REMOVE, CLASS, HIDDEN_CLASS } from "../constants/index.js";
import { inDOM } from "../dom/index.js";

export default (elem, hideMode) => {
  return hideMode === ACTION_REMOVE
    ? inDOM(elem)
    : hideMode === CLASS
    ? !elem.classList.contains(HIDDEN_CLASS)
    : !elem.hasAttribute(hideMode);
};
