import { removeClass, addClass } from "./index.js";
export default (elem, className) => {
  if (!elem || !className) return;
  removeClass(elem, className);
  elem.offsetWidth;
  addClass(elem, className);
  const animations = elem.getAnimations();
  if (animations.length) {
    return Promise.all(animations.map(({ finished }) => finished))
      .then(() => removeClass(elem, className))
      .catch(() => {});
  } else {
    removeClass(elem, className);
  }
};
