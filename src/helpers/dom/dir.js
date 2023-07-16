import { isFunction } from "../is";
import { filter, map, is } from "./index.js";

export default (elem, property, selector, until) => {
  const utilIsFn = isFunction(until);
  return map(elem, (el) => {
    const elems = [];
    while (el) {
      el = el[property];
      if (el) {
        if (until && (utilIsFn ? until(el) : is(el, until))) break;
        elems.push(el);
      }
    }
    return filter(elems, selector);
  }).flat();
};
