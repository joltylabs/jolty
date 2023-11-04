import { CANCEL, OPTION_BACK_DISMISS, UI_EVENT_PREFIX } from "../constants";
import { isDialog } from "../is/index.js";
import CloseWatcher from "../CloseWatcher.js";

export default function (s, instance) {
  const { base, on, opts, off } = instance;

  if (isDialog(base)) {
    if (s) {
      on(base, CANCEL + UI_EVENT_PREFIX, (event) => {
        event.preventDefault();
        if (opts[OPTION_BACK_DISMISS]) {
          instance.hide({ event });
        }
      });
    } else {
      off(base, CANCEL + UI_EVENT_PREFIX);
    }
  }
  if (s) {
    instance._closeWatcher = new CloseWatcher();
    instance._closeWatcher.onclose = (event) => {
      instance.hide({ event });
    };
  } else {
    instance._closeWatcher?.destroy();
    instance._closeWatcher = null;
  }
}
