import getElements from "./getElements.js";

export default (elems, fn) => getElements(elems).map(fn);
