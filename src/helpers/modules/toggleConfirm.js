import { CONFIRM, EVENT_CLICK, UI_EVENT_PREFIX } from "../constants/index.js";
import { closest } from "../dom/index.js";

export default (instance) => {
  instance.on(instance.base, EVENT_CLICK + UI_EVENT_PREFIX, (event) => {
    const trigger = closest(event.target, instance.opts[CONFIRM]);
    trigger && instance.emit(CONFIRM, { event, trigger });
  });
};
