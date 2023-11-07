import {
  EVENT_SHOW,
  EVENT_HIDE,
  ARROW,
  doc,
  EVENT_SHOWN,
  EVENT_HIDDEN,
  FLOATING,
  POPOVER_API_SUPPORTED,
  POPOVER_API_MODE_MANUAL,
  OPTION_LIGHT_DISMISS,
  AUTO,
  MODAL,
} from "../constants";
import { getDataSelector } from "../utils";
import Floating from "../Floating.js";
import { focus } from "../dom/index.js";
import toggleBackDismiss from "./toggleBackDismiss.js";
import callAutofocus from "./callAutofocus.js";
import toggleHideModeState from "./toggleHideModeState.js";
import { addLightDismiss, togglePreventScroll } from "./index.js";
import { isModal } from "../is/index.js";

export const EVENT_SUFFIX_LIGHT_DISMISS = "." + OPTION_LIGHT_DISMISS;

export default (instance, { s, animated, silent, eventParams }) => {
  const { transition, base, opts, toggler, emit, constructor, teleport } =
    instance;
  const name = constructor.NAME;
  const target = instance[name];
  const anchor = toggler ?? base;

  s && toggleHideModeState(true, instance, target);

  if (s) {
    teleport.move(instance);
    instance[FLOATING] = new Floating({
      base,
      anchor,
      target,
      name,
      arrow: target.querySelector(getDataSelector(name, ARROW)),
      opts,
      instance,
    }).init();
    togglePreventScroll(instance, true);
  }

  !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

  if (!s && isModal(target)) {
    target.close();
    if (POPOVER_API_SUPPORTED) {
      target.popover = POPOVER_API_MODE_MANUAL;
      target.showPopover();
    } else {
      animated = false;
    }
  }

  const promise = transition?.run(s, animated);

  if (
    opts[OPTION_LIGHT_DISMISS] === AUTO
      ? opts[MODAL]
      : opts[OPTION_LIGHT_DISMISS]
  ) {
    if (s) {
      addLightDismiss(instance);
    } else {
      instance.off(doc, EVENT_SUFFIX_LIGHT_DISMISS);
    }
  }

  toggleBackDismiss(s, instance);

  if (s) {
    (opts.autofocus || opts.focusTrap) && callAutofocus(instance);
  } else {
    !s && target.contains(doc.activeElement) && focus(toggler);
  }

  (async () => {
    if (!s) {
      if (animated) {
        await promise;
      }
      if (instance.placeholder) {
        target.replaceWith(instance.placeholder);
      }
      teleport.reset();
      instance[FLOATING]?.destroy();
      instance[FLOATING] = null;
      toggleHideModeState(false, instance, target);
      togglePreventScroll(instance, false);
    }
    emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
  })();

  return promise;
};
