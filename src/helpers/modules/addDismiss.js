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
  instance.on(
    elem,
    eventName,
    isString(instance.opts[DISMISS])
      ? instance.opts[DISMISS]
      : `[${DATA_UI_PREFIX + DISMISS}=""],[${DATA_UI_PREFIX + DISMISS}="${
          instance.constructor.NAME
        }"]`,
    (event) => {
      event.preventDefault();
      if (
        event.deligateTarget.hasAttribute(DATA_UI_PREFIX + DISMISS + "-stop")
      ) {
        event.stopPropagation();
      }
      const eventParams = { event, trigger: event.deligateTarget };
      action(eventParams);
      if (instance.constructor[PRIVATE_OPTION_CANCEL_ON_HIDE]) {
        instance.emit(CANCEL, eventParams);
      }
    },
  );
}
