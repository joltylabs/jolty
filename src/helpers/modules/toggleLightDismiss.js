import {
  AUTO,
  EVENT_SUFFIX_LIGHT_DISMISS,
  MODAL,
  OPTION_LIGHT_DISMISS,
} from "../constants/index.js";
import { addLightDismiss } from "./index.js";

export default (instance, s) => {
  if (s) {
    if (
      instance.opts[OPTION_LIGHT_DISMISS] === AUTO
        ? instance.opts[MODAL]
        : instance.opts[OPTION_LIGHT_DISMISS]
    ) {
      addLightDismiss(instance);
    }
  } else {
    instance.off("*", EVENT_SUFFIX_LIGHT_DISMISS);
    instance._mousedownEvent = null;
  }
};
