import {
  HOVER,
  FOCUS,
  CLICK,
  EVENT_CLICK,
  EVENT_MOUSEENTER,
  EVENT_MOUSELEAVE,
  EVENT_FOCUSOUT,
  EVENT_FOCUSIN,
  EVENT_MOUSEDOWN,
  UI_EVENT_PREFIX,
  TRIGGER,
  MODAL,
  PRIVATE_PREFIX,
} from "../constants";
import { isArray } from "../is";

const PREFIX = UI_EVENT_PREFIX + "-" + TRIGGER;

export default (
  instance,
  toggler = instance.toggler,
  target = instance.base,
) => {
  let {
    opts: { trigger, delay, mode },
    toggle,
    on,
  } = instance;

  if (instance[PRIVATE_PREFIX + TRIGGER]) {
    instance.off("*", PREFIX);
    instance[PRIVATE_PREFIX + TRIGGER] = false;
  }

  if (!trigger) return;

  const triggerClick = trigger.includes(CLICK);
  const triggerHover = mode !== MODAL && trigger.includes(HOVER);
  const triggerFocus = mode !== MODAL && trigger.includes(FOCUS);
  const events = [];
  let isMouseDown = false;
  let hoverTimer;
  if (triggerHover) {
    delay = isArray(delay) ? delay : [delay, delay];
  }
  if (triggerClick) {
    on(toggler, EVENT_CLICK + PREFIX, (event) => {
      if (
        instance.isOpen &&
        instance.transition.isAnimating &&
        instance.floating.floatings.size
      )
        return;
      toggle(null, { event, trigger: toggler });
    });
  }
  if (triggerHover) {
    events.push(EVENT_MOUSEENTER + PREFIX, EVENT_MOUSELEAVE + PREFIX);
  }
  if (triggerFocus) {
    events.push(EVENT_FOCUSIN + PREFIX, EVENT_FOCUSOUT + PREFIX);

    triggerClick &&
      on(toggler, EVENT_MOUSEDOWN, () => {
        isMouseDown = true;
        clearTimeout(hoverTimer);
        requestAnimationFrame(() => (isMouseDown = false));
      });
  }

  if (triggerHover || triggerFocus) {
    on([toggler, target], events, (event) => {
      const { type } = event;
      const isFocus = type === EVENT_FOCUSIN || type === EVENT_FOCUSOUT;
      if (
        (type === EVENT_FOCUSIN && isMouseDown) ||
        (type === EVENT_FOCUSOUT && triggerHover && target.matches(":" + HOVER))
      ) {
        return;
      }

      const entered =
        (triggerHover && type === EVENT_MOUSEENTER) ||
        (triggerFocus && type === EVENT_FOCUSIN);
      const d = isFocus ? 0 : delay[entered ? 0 : 1];
      clearTimeout(hoverTimer);

      if (d) {
        hoverTimer = setTimeout(
          () => toggle(entered, { trigger: toggler, event }),
          d,
        );
      } else {
        toggle(entered, { event, trigger: event.target });
      }
    });
  }

  instance[PRIVATE_PREFIX + TRIGGER] = true;
};
