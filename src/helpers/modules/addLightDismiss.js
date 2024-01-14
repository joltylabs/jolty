import {
  CANCEL,
  DIALOG,
  EVENT_CLICK,
  EVENT_CONTEXT_MENU_CLICK,
  EVENT_KEYUP,
  EVENT_LIGHT_DISMISS_PREVENT,
  EVENT_MOUSEDOWN,
  EVENT_SUFFIX_LIGHT_DISMISS,
  FLOATING_DATA_ATTRIBUTE,
  OPTION_LIGHT_DISMISS,
  PREVENT,
  PRIVATE_OPTION_CANCEL_ON_HIDE,
  UI_PREFIX,
} from "../constants/index.js";
import { animateClass, parents } from "../dom/index.js";
import Base from "../Base.js";
import { camelToKebab, isClickOutsideElem } from "../utils/index.js";
import { isModal } from "../is/index.js";

export default (instance) => {
  const { constructor, opts, _on, _emit } = instance;
  const base = instance[constructor.NAME];
  const contentElem = instance.main || base;

  const events = [
    EVENT_CLICK + EVENT_SUFFIX_LIGHT_DISMISS,
    EVENT_KEYUP + EVENT_SUFFIX_LIGHT_DISMISS,
    (opts[OPTION_LIGHT_DISMISS]?.contextMenuClick ?? true) &&
      EVENT_CONTEXT_MENU_CLICK + EVENT_SUFFIX_LIGHT_DISMISS,
  ];

  _on(contentElem, EVENT_MOUSEDOWN + EVENT_SUFFIX_LIGHT_DISMISS, (e) => {
    instance._mousedownEvent = e;
  });

  _on(document, events, (event) => {
    const target = event.target;
    if (
      !instance.isOpen ||
      instance._isOpening ||
      (opts.awaitAnimation && instance.transition?.isAnimating)
    )
      return;

    const _mousedownEvent = instance._mousedownEvent;
    const isBaseModal = isModal(base);

    let isClickOutside;

    if (
      !_mousedownEvent &&
      (target === instance.toggler || target === instance.anchor)
    ) {
      instance._mousedownEvent = null;
      return;
    }

    const backdrop = instance.backdrop;
    const isBackdropClick = !_mousedownEvent && target === backdrop;
    const isTargetNotInside =
      (!backdrop || !base.contains(backdrop)) &&
      !_mousedownEvent &&
      !base.contains(target);
    const targetIsBase = !backdrop && target === base;

    if (
      isBackdropClick ||
      isTargetNotInside ||
      (targetIsBase &&
        (!_mousedownEvent
          ? isClickOutsideElem(contentElem, event)
          : isClickOutsideElem(contentElem, _mousedownEvent)))
    ) {
      isClickOutside = true;
    }

    if (isClickOutside && (target === backdrop || isBaseModal)) {
      if (opts[OPTION_LIGHT_DISMISS] === PREVENT) {
        instance._mousedownEvent = null;
        animateClass(
          contentElem,
          camelToKebab(UI_PREFIX + EVENT_LIGHT_DISMISS_PREVENT),
        );
        _emit(EVENT_LIGHT_DISMISS_PREVENT, { event });
        return;
      }
    }

    if (!isClickOutside && !opts.modal && !target.closest("#" + instance.id)) {
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
        _emit(CANCEL, { event });
      }
    }

    instance._mousedownEvent = null;
  });
};
