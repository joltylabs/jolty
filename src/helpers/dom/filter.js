import isFunction from "../is/isFunction.js";
import is from "./is.js";
import arrayFrom from "../utils/arrayFrom.js";

export default (elems, selector) => {
  const isFn = isFunction(selector);
  elems = arrayFrom(elems);
  return selector
    ? elems.filter((elem, i, list) =>
        isFn ? selector(elem, i, list) : is(elem, selector),
      )
    : elems;
};
