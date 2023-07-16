import { getElements } from "./index.js";
export default (elem, selectors) =>
  getElements(selectors).find((t) => t === elem || t.contains(elem));
