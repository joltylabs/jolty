import {
  CANCEL,
  DIALOG,
  EVENT_CLICK,
  EVENT_CONTEXT_MENU_CLICK,
  EVENT_KEYUP,
  EVENT_MOUSEDOWN,
  EVENT_SUFFIX_LIGHT_DISMISS,
  FLOATING_DATA_ATTRIBUTE,
  OPTION_LIGHT_DISMISS,
  PRIVATE_OPTION_CANCEL_ON_HIDE,
  UI_PREFIX,
} from "../constants/index.js";
import { parents } from "../dom/index.js";
import Base from "../Base.js";
import { isClickOutsideElem } from "../utils/index.js";

export default (instance) => {
  const { constructor, opts, on, emit } = instance;
  const base = instance[constructor.NAME];
  const contentElem = instance.main || base;

  const events = [
    EVENT_CLICK + EVENT_SUFFIX_LIGHT_DISMISS,
    EVENT_KEYUP + EVENT_SUFFIX_LIGHT_DISMISS,
    (opts[OPTION_LIGHT_DISMISS]?.contextMenuClick ?? true) &&
      EVENT_CONTEXT_MENU_CLICK + EVENT_SUFFIX_LIGHT_DISMISS,
  ];

  on(contentElem, EVENT_MOUSEDOWN + EVENT_SUFFIX_LIGHT_DISMISS, (e) => {
    instance._mousedownEvent = e;
  });

  on(document, events, (event) => {
    const target = event.target;
    if (
      !instance.isOpen ||
      instance._isOpening ||
      (opts.awaitAnimation && instance.transition?.isAnimating)
    )
      return;

    const _mousedownEvent = instance._mousedownEvent;

    let isClickOutside;

    if (
      !_mousedownEvent &&
      (target === instance.toggler || target === instance.anchor)
    ) {
      instance._mousedownEvent = null;
      return;
    }

    if (
      (!_mousedownEvent && target === instance.backdrop) ||
      (!_mousedownEvent && !base.contains(target)) ||
      (target === base &&
        (!_mousedownEvent
          ? isClickOutsideElem(contentElem, event)
          : isClickOutsideElem(contentElem, _mousedownEvent)))
    ) {
      isClickOutside = true;
    }

    if (
      !isClickOutside &&
      !instance.opts.modal &&
      !target.closest("#" + instance.id)
    ) {
      const targetInstance =
        constructor.get(target) ||
        parents(
          target,
          `[${FLOATING_DATA_ATTRIBUTE}],.${UI_PREFIX + DIALOG}-init`,
        ).find((parent) => Base.get(parent));

      if ((!targetInstance || instance.floating) && !_mousedownEvent) {
        isClickOutside = true;
      }

      if (
        instance.floating &&
        (instance.floating.anchor === target ||
          instance.floating.anchor.contains(target))
      ) {
        return;
      }
    }

    if (isClickOutside) {
      instance.hide({ event });
      if (constructor[PRIVATE_OPTION_CANCEL_ON_HIDE]) {
        emit(CANCEL, { event });
      }
    }

    instance._mousedownEvent = null;
  });
};
