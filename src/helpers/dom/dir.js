import isFunction from "../is/isFunction.js";
import is from "./is.js";
import map from "./map.js";
import filter from "./filter.js";

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
