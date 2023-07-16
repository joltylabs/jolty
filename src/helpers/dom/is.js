import { isString, isIterable, isFunction } from "../is";
import { arrayFrom } from "../utils";
export default (elem, selector) =>
  elem === selector
    ? true
    : isString(selector)
    ? elem.matches(selector)
    : isIterable(selector)
    ? arrayFrom(selector).includes(elem)
    : isFunction(selector) && selector(elem);
