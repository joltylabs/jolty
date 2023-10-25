import isArray from "../is/isArray.js";
import camelToKebab from "../utils/camelToKebab.js";

export default (elem, ...names) => {
  if (isArray(elem)) {
    elem.forEach((elem) =>
      names.forEach((name) => elem && elem.removeAttribute(camelToKebab(name))),
    );
  } else {
    names.forEach((name) => elem && elem.removeAttribute(camelToKebab(name)));
  }
};
