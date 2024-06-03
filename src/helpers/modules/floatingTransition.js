import {
  EVENT_SHOW,
  EVENT_HIDE,
  ARROW,
  EVENT_SHOWN,
  EVENT_HIDDEN,
  FLOATING,
  TOOLTIP,
  EVENT_KEYDOWN,
  OPTION_BACK_DISMISS,
  KEY_ESC,
  EVENT_MOUSEENTER,
} from "../constants";
import { getDataSelector } from "../utils";
import Floating from "../Floating.js";
import { focus } from "../dom/index.js";
import toggleBackDismiss from "./toggleBackDismiss.js";
import callAutofocus from "./callAutofocus.js";
import toggleStateMode from "./toggleStateMode.js";
import {
  addFrameState,
  toggleLightDismiss,
  togglePreventScroll,
} from "./index.js";

export default (instance, { s, animated, silent, eventParams }) => {
  const { transition, base, opts, toggler, _emit, constructor, teleport } =
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

  !silent && _emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

  const promise = transition?.run(s, animated);

  toggleLightDismiss(instance, s);

  if (name === TOOLTIP) {
    if (s) {
      instance._on(
        document,
        EVENT_KEYDOWN + "." + OPTION_BACK_DISMISS,
        (event) => {
          if (!event.isTrusted || event.keyCode !== KEY_ESC) return;
          instance.hide({ event });
        },
      );
    } else {
      instance._off(document, EVENT_KEYDOWN + "." + OPTION_BACK_DISMISS);
    }
  } else {
    toggleBackDismiss(s, instance);
  }

  if (s) {
    (opts.autofocus || opts.focusTrap) &&
      eventParams?.event?.type !== EVENT_MOUSEENTER &&
      callAutofocus(instance);
  } else {
    !s && target.contains(document.activeElement) && focus(toggler);
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
    _emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
  })();

  return promise;
};
