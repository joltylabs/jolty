import isArray from "../is/isArray.js";
import isFunction from "../is/isFunction.js";
import camelToKebab from "../utils/camelToKebab.js";

export default function setAttribute(elem, name, value) {
  if (!elem) return;
  name = camelToKebab(name);
  if (isArray(elem)) {
    return elem.forEach((elem) => setAttribute(elem, name, value));
  }
  if (isFunction(value)) {
    value = value(elem.name);
  }
  if (value === null) {
    elem.removeAttribute(name);
  } else if (value !== undefined) {
    elem.setAttribute(name, value);
  }
}
