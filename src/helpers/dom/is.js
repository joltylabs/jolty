import isString from "../is/isString.js";
import isIterable from "../is/isIterable.js";
import isFunction from "../is/isFunction.js";
import arrayFrom from "../utils/arrayFrom.js";

export default (elem, selector) =>
  elem === selector
    ? true
    : isString(selector)
    ? elem.matches(selector)
    : isIterable(selector)
    ? arrayFrom(selector).includes(elem)
    : isFunction(selector) && selector(elem);
