import filter from "./filter.js";
import without from "../utils/without.js";

export default (elem, selector) =>
  filter(without(elem.parentNode.children, elem), selector);
