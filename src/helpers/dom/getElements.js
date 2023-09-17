import { doc, DOCUMENT, WINDOW } from "../constants/index.js";
import isElement from "../is/isElement.js";
import isString from "../is/isString.js";
import isHTML from "../is/isHTML.js";
import isIterable from "../is/isIterable.js";
import is from "./is.js";
import arrayFrom from "../utils/arrayFrom.js";
import returnArray from "../utils/returnArray.js";
import arrayUnique from "../utils/arrayUnique.js";
import fragment from "./fragment.js";

export default function getElements(selector, context = doc, findSelf = false) {
  if (isElement(selector)) {
    return [selector];
  }
  let result = selector;
  if (isString(context)) {
    context = doc.querySelector(context);
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
