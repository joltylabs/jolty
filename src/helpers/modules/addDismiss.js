import {
  CANCEL,
  DATA_UI_PREFIX,
  DISMISS,
  EVENT_CLICK,
  PRIVATE_OPTION_CANCEL_ON_HIDE,
  PRIVATE_PREFIX,
  UI_EVENT_PREFIX,
} from "../constants";
import { isString } from "../is";
const eventName = EVENT_CLICK + UI_EVENT_PREFIX + "-" + DISMISS;
export default function (
  instance,
  elem = instance.base,
  action = instance.hide,
) {
  if (instance[PRIVATE_PREFIX + DISMISS]) {
    instance.off(elem, eventName);
    instance[PRIVATE_PREFIX + DISMISS] = false;
  }
  if (instance.opts[DISMISS]) {
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
        event.stopPropagation();
        const eventParams = { event, trigger: event.deligateTarget };
        action(eventParams);
        if (instance.constructor[PRIVATE_OPTION_CANCEL_ON_HIDE]) {
          instance.emit(CANCEL, eventParams);
        }
      },
    );
    instance[PRIVATE_PREFIX + DISMISS] = true;
  }
}
