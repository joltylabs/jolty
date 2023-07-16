import { isElement, isString, isIterable, isHTML } from "../is";
import { arrayUnique, returnArray, arrayFrom } from "../utils";
import { getElement, is } from "../dom";
import { WINDOW, DOCUMENT, doc } from "../constants";
import { fragment } from "./index.js";

export default function getElements(selector, context = doc, findSelf = false) {
  if (isElement(selector)) {
    return [selector];
  }
  let result = selector;
  if (isString(context)) {
    context = getElement(context);
  }
  if (!isElement(context) || !selector) return [];
  if (isString(selector)) {
    selector = selector.trim();
    if (selector === DOCUMENT) {
      result = doc;
    } else if (selector === WINDOW) {
      result = window;
    } else if (isHTML(selector)) {
      result = fragment(selector);
    } else {
      result = context.querySelectorAll(selector);
    }
  } else if (isIterable(selector)) {
    result = arrayFrom(selector, (item) => getElements(item, context)).flat();
  }

  result = returnArray(result);

  if (findSelf && is(context, selector)) {
    result.unshift(context);
  }
  return arrayUnique(result).filter(Boolean);
}
