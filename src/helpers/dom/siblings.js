import { filter } from "./index.js";
import { without } from "../utils";
export default (elem, selector) =>
  filter(without(elem.parentNode.children, elem), selector);
