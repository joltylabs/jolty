import { getElements } from "./index.js";
export default (elems, fn) => {
  elems = getElements(elems);
  elems.forEach(fn);
  return elems;
};
