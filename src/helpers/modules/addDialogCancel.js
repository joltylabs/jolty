import { isDialog } from "../is/index.js";
import {
  CANCEL,
  OPTION_BACK_DISMISS,
  UI_EVENT_PREFIX,
} from "../constants/index.js";

export default (instance) => {
  if (isDialog(instance.base)) {
    instance.on(instance.base, CANCEL + UI_EVENT_PREFIX, (event) => {
      event.preventDefault();
      if (instance.opts[OPTION_BACK_DISMISS]) {
        instance.hide({ event });
      }
    });
  }
};
