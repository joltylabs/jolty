import {
  CANCEL,
  DATA_UI_PREFIX,
  DISMISS,
  EVENT_CLICK,
  PRIVATE_OPTION_CANCEL_ON_HIDE,
  UI_EVENT_PREFIX,
} from "../constants";
import { isString } from "../is";
const eventName = EVENT_CLICK + UI_EVENT_PREFIX + "-" + DISMISS;
export default function (
  instance,
  elem = instance.base,
  action = instance.hide,
) {
  instance._on(
    elem,
    eventName,
    isString(instance.opts[DISMISS])
      ? instance.opts[DISMISS]
      : `[${DATA_UI_PREFIX + DISMISS}=""],[${DATA_UI_PREFIX + DISMISS}="${
          instance.constructor.NAME
        }"]`,
    (event) => {
      if (event.__dismissTriggered) return;
      event.preventDefault();
      event.__dismissTriggered = true;
      const eventParams = { event, trigger: event.deligateTarget };
      action(eventParams);
      if (instance.constructor[PRIVATE_OPTION_CANCEL_ON_HIDE]) {
        instance._emit(CANCEL, eventParams);
      }
    },
  );
}
