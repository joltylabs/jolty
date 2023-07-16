import { getElements } from "./index.js";
export default (elems, fn) => getElements(elems).map(fn);
