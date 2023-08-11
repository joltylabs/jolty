import { DATA_UI_PREFIX, DISMISS, EVENT_CLICK } from "../constants";
import { isString } from "../is";
const eventName = EVENT_CLICK + "." + DISMISS;
export default function (
  instance,
  elem = instance.base,
  action = instance.hide,
) {
  if (instance._dismiss) {
    instance.off(elem, eventName);
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
        action({ event, trigger: event.deligateTarget });
      },
    );
    instance._dismiss = true;
  }
}
