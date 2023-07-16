import { isIterable } from "../is";
import { strToArray } from "../utils";
export default (elem, names) => {
  names = strToArray(names);
  if (isIterable(elem)) {
    elem.forEach((elem) =>
      names.forEach((name) => elem && elem.removeAttribute(name)),
    );
  } else {
    names.forEach((name) => elem && elem.removeAttribute(name));
  }
};
