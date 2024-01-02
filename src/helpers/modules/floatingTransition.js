import {
  EVENT_SHOW,
  EVENT_HIDE,
  ARROW,
  doc,
  EVENT_SHOWN,
  EVENT_HIDDEN,
  FLOATING,
  OPTION_LIGHT_DISMISS,
  AUTO,
  MODAL,
  TOOLTIP,
  EVENT_KEYDOWN,
  OPTION_BACK_DISMISS,
  KEY_ESC,
} from "../constants";
import { getDataSelector } from "../utils";
import Floating from "../Floating.js";
import { focus } from "../dom/index.js";
import toggleBackDismiss from "./toggleBackDismiss.js";
import callAutofocus from "./callAutofocus.js";
import toggleStateMode from "./toggleStateMode.js";
import {
  addFrameState,
  addLightDismiss,
  toggleLightDismiss,
  togglePreventScroll,
} from "./index.js";

export const EVENT_SUFFIX_LIGHT_DISMISS = "." + OPTION_LIGHT_DISMISS;

export default (instance, { s, animated, silent, eventParams }) => {
  const { transition, base, opts, toggler, emit, constructor, teleport } =
    instance;
  const name = constructor.NAME;
  const target = instance[name];
  const anchor = toggler ?? base;

  s && toggleStateMode(true, instance, target);

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

  addFrameState(instance, s);

  !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

  const promise = transition?.run(s, animated);

  toggleLightDismiss(instance, s);

  if (name === TOOLTIP) {
    if (s) {
      instance.on(doc, EVENT_KEYDOWN + "." + OPTION_BACK_DISMISS, (event) => {
        if (!event.isTrusted || event.keyCode !== KEY_ESC) return;
        instance.hide({ event });
      });
    } else {
      instance.off(doc, EVENT_KEYDOWN + "." + OPTION_BACK_DISMISS);
    }
  } else {
    toggleBackDismiss(s, instance);
  }

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
      toggleStateMode(false, instance, target);
      togglePreventScroll(instance, false);
    }
    emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
  })();

  return promise;
};
