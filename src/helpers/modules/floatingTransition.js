import {
  EVENT_SHOW,
  EVENT_HIDE,
  ARROW,
  doc,
  EVENT_SHOWN,
  EVENT_HIDDEN,
  FLOATING,
  EVENT_ACTION_OUTSIDE,
  MODAL,
  POPOVER_API_SUPPORTED,
  POPOVER_API_MODE_MANUAL,
} from "../constants";
import { getDataSelector } from "../utils";
import Floating from "../Floating.js";
import { closest, focus } from "../dom/index.js";
import addEscapeHide from "./addEscapeHide.js";
import callAutofocus from "./callAutofocus.js";
import toggleHideModeState from "./toggleHideModeState.js";

export default (instance, { s, animated, silent, eventParams }) => {
  const { transition, base, opts, toggler, emit, constructor, teleport } =
    instance;
  const name = constructor.NAME;
  const target = instance[name];
  const anchor = toggler ?? base;

  s && toggleHideModeState(true, instance, target);

  if (s) {
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

  if (!s && wrapper?.matches(":" + MODAL)) {
    wrapper.close();
    if (POPOVER_API_SUPPORTED) {
      wrapper.popover = POPOVER_API_MODE_MANUAL;
      wrapper.showPopover();
    } else {
      animated = false;
    }
  }

  const promise = transition?.run(s, animated);

  if (s && opts.outsideHide) {
    instance.on(
      doc,
      EVENT_ACTION_OUTSIDE,
      (event) =>
        !closest(event.target, [toggler ?? base, target]) &&
        instance.hide({ event }),
    );
  } else {
    instance.off(doc, EVENT_ACTION_OUTSIDE);
  }

  opts.escapeHide &&
    addEscapeHide(
      instance,
      s,
      instance.toggler ? [instance.toggler, instance.base] : doc,
    );

  if (s) {
    opts.autofocus && callAutofocus(instance);
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
    }
    emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
  })();

  return promise;
};
