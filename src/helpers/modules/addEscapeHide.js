import { EVENT_KEYDOWN, KEY_ESC, CANCEL } from "../constants";
const eventName = EVENT_KEYDOWN + ".escapeHide";

export default function (instance, s, elem = instance.base) {
  if (s) {
    instance.on(elem, eventName, (event) => {
      if (event.keyCode === KEY_ESC) {
        (instance.opts.escapeHide.stop ?? true) && event.stopPropagation();
        instance.hide({ event });
        instance.emit(CANCEL, { event });
      }
    });
  } else {
    instance.off(elem, eventName);
  }
}
