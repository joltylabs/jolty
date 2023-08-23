import { BOTTOM, HEIGHT, LEFT, RIGHT, TOP, WIDTH } from "../constants/index.js";
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

export default (elem, useScale) => {
  const rect = elem.getBoundingClientRect().toJSON();

  if (!useScale) return rect;

  const vV = visualViewport;
  const hasScale = vV.scale > 1.01 || vV.scale < 0.99;
  const iosScale = window.innerWidth / document.documentElement.clientWidth;
  const hasIosScale = iosScale > 1.01 || iosScale < 0.99;
  const keyboardOpen = vV.height !== window.innerHeight;

  if (
    (!hasScale && hasIosScale) ||
    (keyboardOpen && hasScale && hasIosScale) ||
    (!hasScale && keyboardOpen && isIOS)
  ) {
    rect[TOP] += vV.offsetTop;
    rect[LEFT] += vV.offsetLeft;
    rect[RIGHT] = rect[LEFT] + rect[WIDTH];
    rect[BOTTOM] = rect[TOP] + rect[HEIGHT];
  }

  return rect;
};
