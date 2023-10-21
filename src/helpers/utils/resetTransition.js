import { NONE } from "../constants/index.js";

export default (elem, after) => {
  const cache = elem.style.transition;
  elem.style.transition = NONE;
  after?.();
  elem.offsetWidth;
  elem.style.transition = cache;
};
