import { EVENT_MOUSEDOWN, UI_EVENT_PREFIX } from "../constants/index.js";

export default (instance, elem, s) => {
  if (s) {
    instance.on(elem, EVENT_MOUSEDOWN + UI_EVENT_PREFIX, (e) => {
      instance._mousedownTarget = e.target;
    });
  } else {
    instance._mousedownTarget = null;
    instance.off(elem, EVENT_MOUSEDOWN + UI_EVENT_PREFIX);
  }
};
