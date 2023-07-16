import { dir } from "./index.js";
export default (elem, selector, until) =>
  dir(elem, "nextElementSibling", selector, until);
