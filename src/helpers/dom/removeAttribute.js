import isArray from "../is/isArray.js";

export default (elem, ...names) => {
  if (isArray(elem)) {
    elem.forEach((elem) =>
      names.forEach((name) => elem && elem.removeAttribute(name)),
    );
  } else {
    names.forEach((name) => elem && elem.removeAttribute(name));
  }
};
