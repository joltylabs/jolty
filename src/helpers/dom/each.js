import getElements from "./getElements.js";

export default (elems, fn) => {
  elems = getElements(elems);
  elems.forEach(fn);
  return elems;
};
