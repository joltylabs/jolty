import {
  AUTO,
  CANCEL,
  MODAL,
  OPTION_BACK_DISMISS,
  UI_EVENT_PREFIX,
} from "../constants";
import { isDialog } from "../is/index.js";
import getCloseWatcher from "../CloseWatcher.js";

export default function (s, instance) {
  const { base, _on, _off, opts } = instance;

  if (isDialog(base)) {
    if (s) {
      _on(base, CANCEL + UI_EVENT_PREFIX, (event) => {
        event.preventDefault();
      });
    } else {
      _off(base, CANCEL + UI_EVENT_PREFIX);
    }
  }
  if (s) {
    if (
      opts[OPTION_BACK_DISMISS] === AUTO
        ? opts[MODAL]
        : opts[OPTION_BACK_DISMISS]
    ) {
      const CloseWatcher = getCloseWatcher();
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
