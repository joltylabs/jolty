import dir from "./dir.js";

export default (elem, selector, until) =>
  dir(elem, "nextElementSibling", selector, until);
