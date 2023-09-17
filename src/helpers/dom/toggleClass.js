import { ACTION_ADD, ACTION_REMOVE } from "../constants";
import isArray from "../is/isArray.js";
import isElement from "../is/isElement.js";
import isIterable from "../is/isIterable.js";
import strToArray from "../utils/strToArray.js";

export default function toggleClass(elem, classes, s) {
  if (isArray(classes)) {
    classes = classes.filter(Boolean).join(" ");
  }
  const cls = strToArray(classes);
  if (isElement(elem)) {
    s ??= !elem.classList.contains(cls[0]);
    elem.classList[s ? ACTION_ADD : ACTION_REMOVE](...cls);
  } else if (isIterable(elem)) {
    elem.forEach((el) => toggleClass(el, cls, s));
  }
}
