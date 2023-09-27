import {
  EVENT_KEYDOWN,
  KEY_ESC,
  CANCEL,
  PRIVATE_OPTION_CANCEL_ON_HIDE,
} from "../constants";
const eventName = EVENT_KEYDOWN + ".escapeHide";

export default function (instance, s, elem) {
  if (s) {
    instance.on(elem, eventName, (event) => {
      if (event.keyCode === KEY_ESC) {
        (instance.opts.escapeHide.stop ?? true) && event.stopPropagation();
        instance.hide({ event });
        if (instance.constructor[PRIVATE_OPTION_CANCEL_ON_HIDE]) {
          instance.emit(CANCEL, { event });
        }
      }
    });
  } else {
    instance.off(elem, eventName);
  }
}
