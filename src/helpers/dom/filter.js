import { isFunction } from "../is";
import { is } from "../dom";
import { arrayFrom } from "../utils";

export default (elems, selector) => {
  const isFn = isFunction(selector);
  elems = arrayFrom(elems);
  return selector
    ? elems.filter((elem, i, list) =>
        isFn ? selector(elem, i, list) : is(elem, selector),
      )
    : elems;
};
