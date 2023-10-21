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
  EVENT_CONTEXT_MENU_CLICK,
  EVENT_CLICK,
  EVENT_KEYUP,
  EVENT_SUFFIX_OUTSIDE,
  OPTION_BACK_DISMISS,
} from "../constants";
import { getDataSelector } from "../utils";
import Floating from "../Floating.js";
import { closest, focus } from "../dom/index.js";
import addBackDismiss from "./addBackDismiss.js";
import callAutofocus from "./callAutofocus.js";
import toggleHideModeState from "./toggleHideModeState.js";
import { toggleMouseDownTarget, togglePreventScroll } from "./index.js";
import { isModal } from "../is/index.js";

export default (instance, { s, animated, silent, eventParams }) => {
  const { transition, base, opts, toggler, emit, constructor, teleport } =
    instance;
  const name = constructor.NAME;
  const target = instance[name];
  const anchor = toggler ?? base;

  s && toggleHideModeState(true, instance, target);

  if (s) {
    togglePreventScroll(instance, true);
    instance[FLOATING] = new Floating({
      teleport,
      base,
      anchor,
      target,
      arrow: target.querySelector(getDataSelector(name, ARROW)),
      opts,
      name,
      instance,
    }).init();
  }

  !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

  const wrapper = instance[FLOATING]?.wrapper;

  if (!s && isModal(wrapper)) {
    wrapper.close();
    if (POPOVER_API_SUPPORTED) {
      wrapper.popover = POPOVER_API_MODE_MANUAL;
      wrapper.showPopover();
    } else {
      animated = false;
    }
  }

  const promise = transition?.run(s, animated);

  toggleMouseDownTarget(instance, target, s);

  if (s && opts.outsideHide) {
    const outsideHideEvents = [
      EVENT_CLICK + EVENT_SUFFIX_OUTSIDE,
      EVENT_KEYUP + EVENT_SUFFIX_OUTSIDE,
      (opts.outsideHide.contextMenuClick ?? true) &&
        EVENT_CONTEXT_MENU_CLICK + EVENT_SUFFIX_OUTSIDE,
    ];
    instance.on(doc, outsideHideEvents, (event) => {
      if (!instance.isOpen) return;
      if (!instance._mousedownTarget) {
        !closest(event.target, [toggler ?? base, target]) &&
          instance.hide({ event });
      }
      instance._mousedownTarget = null;
    });
  } else {
    instance.off(doc, ".outside");
  }

  opts[OPTION_BACK_DISMISS] &&
    addBackDismiss(
      instance,
      s,
      instance.toggler ? [instance.toggler, instance.base] : doc,
    );

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
        wrapper.replaceWith(instance.placeholder);
      }
      instance[FLOATING]?.destroy();
      instance[FLOATING] = null;
      toggleHideModeState(false, instance, target);
      togglePreventScroll(instance, false);
    }
    emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
  })();

  return promise;
};
