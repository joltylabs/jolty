import {
  AUTO,
  CANCEL,
  MODAL,
  OPTION_BACK_DISMISS,
  OPTION_LIGHT_DISMISS,
  UI_EVENT_PREFIX,
} from "../constants";
import { isDialog } from "../is/index.js";
import CloseWatcher from "../CloseWatcher.js";

export default function (s, instance) {
  const { base, on, off, opts } = instance;

  if (isDialog(base)) {
    if (s) {
      on(base, CANCEL + UI_EVENT_PREFIX, (event) => {
        event.preventDefault();
      });
    } else {
      off(base, CANCEL + UI_EVENT_PREFIX);
    }
  }
  if (s) {
    if (
      opts[OPTION_BACK_DISMISS] === AUTO
        ? opts[MODAL]
        : opts[OPTION_BACK_DISMISS]
    ) {
      instance._closeWatcher = new CloseWatcher();
      instance._closeWatcher.onclose = (event) => {
        instance.hide({ event });
      };
    }
  } else {
    instance._closeWatcher?.destroy();
    instance._closeWatcher = null;
  }
}
