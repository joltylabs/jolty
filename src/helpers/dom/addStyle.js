import isIterable from "../is/isIterable.js";
import isObject from "../is/isObject.js";
import camelToKebab from "../utils/camelToKebab.js";

export default function addStyle(elem, name, value) {
  if (isIterable(elem)) {
    elem.forEach((elem) => addStyle(elem, name, value));
  } else {
    if (isObject(name)) {
      for (const key in name) addStyle(elem, key, name[key]);
    } else {
      elem.style.setProperty(camelToKebab(name), value);
    }
  }
}
