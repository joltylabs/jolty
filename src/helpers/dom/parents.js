import dir from "./dir.js";

export default (elem, selector, until) =>
  dir(elem, "parentElement", selector, until);
