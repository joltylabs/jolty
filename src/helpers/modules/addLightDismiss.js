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

export default (instance, onHide) => {
  const { constructor, opts, on, emit } = instance;
  const base = instance[constructor.NAME];

  const events = [
    EVENT_CLICK + EVENT_SUFFIX_LIGHT_DISMISS,
    EVENT_KEYUP + EVENT_SUFFIX_LIGHT_DISMISS,
    opts[OPTION_LIGHT_DISMISS] &&
      (opts[OPTION_LIGHT_DISMISS]?.contextMenuClick ?? true) &&
      EVENT_CONTEXT_MENU_CLICK + EVENT_SUFFIX_LIGHT_DISMISS,
  ];

  instance.on(
    (constructor.NAME === DIALOG && instance.content) || base,
    EVENT_MOUSEDOWN + EVENT_SUFFIX_LIGHT_DISMISS,
    (e) => {
      instance._mousedownEvent = e;
    },
  );

  on(document, events, (event) => {
    if (
      !instance.isOpen ||
      (opts.awaitAnimation && instance.transition?.isAnimating)
    )
      return;

    const _mousedownEvent = instance._mousedownEvent;

    let isClickOutside;

    if (constructor.NAME === DIALOG && instance.content) {
      isClickOutside =
        !instance.content.contains(event.target) && !_mousedownEvent;
    } else {
      const targetInstance =
        constructor.get(event.target) ||
        parents(
          event.target,
          `[${FLOATING_DATA_ATTRIBUTE}],.${UI_PREFIX + DIALOG}-init`,
        ).find((parent) => {
          return Base.get(parent);
        });

      if (!targetInstance || targetInstance === instance) {
        if (
          instance.floating &&
          (instance.floating.anchor === event.target ||
            instance.floating.anchor.contains(event.target))
        )
          return;

        isClickOutside =
          (!_mousedownEvent && isClickOutsideElem(base, event)) ||
          (_mousedownEvent && isClickOutsideElem(base, _mousedownEvent));
      }
    }

    if (isClickOutside) {
      instance.hide({ event });
      if (constructor[PRIVATE_OPTION_CANCEL_ON_HIDE]) {
        emit(CANCEL, { event });
      }
    }

    instance._mousedownEvent = null;
    onHide?.();
  });
};
