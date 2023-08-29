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
} from "../constants";
import { isArray } from "../is";

export default ({
  toggler,
  target,
  instance,
  trigger,
  action = instance.toggle,
  delay,
}) => {
  const { opts, on } = instance;
  trigger ??= opts.trigger;
  delay ??= opts.delay;

  if (!trigger) return;

  const triggerClick = trigger.includes(CLICK);
  const triggerHover = trigger.includes(HOVER);
  const triggerFocus = trigger.includes(FOCUS);
  const events = [];
  let isMouseDown = false;
  if (triggerHover || triggerFocus) {
    delay = isArray(delay) ? delay : [delay, delay];
  }
  if (triggerClick) {
    on(toggler, EVENT_CLICK, (event) =>
      action(null, { event, trigger: toggler }),
    );
  }
  if (triggerHover) {
    events.push(EVENT_MOUSEENTER, EVENT_MOUSELEAVE);
  }
  if (triggerFocus) {
    events.push(EVENT_FOCUSIN, EVENT_FOCUSOUT);
    on(toggler, EVENT_MOUSEDOWN, () => {
      isMouseDown = true;
      clearTimeout(instance._hoverTimer);
      requestAnimationFrame(() => (isMouseDown = false));
    });
  }
  if (triggerHover || triggerFocus) {
    on([toggler, target], events, (event) => {
      const { type } = event;
      const isFocus = type === EVENT_FOCUSIN || type === EVENT_FOCUSOUT;
      if (
        (type === EVENT_FOCUSIN && isMouseDown) ||
        (type === EVENT_FOCUSOUT && triggerHover && target.matches(":hover"))
      ) {
        return;
      }

      const entered =
        (triggerHover && type === EVENT_MOUSEENTER) ||
        (triggerFocus && type === EVENT_FOCUSIN);
      const d = isFocus ? 0 : delay[entered ? 0 : 1];
      clearTimeout(instance._hoverTimer);
      if (d) {
        instance._hoverTimer = setTimeout(
          () => action(entered, { trigger: toggler, event }),
          d,
        );
      } else {
        action(entered, { event, trigger: event.target });
      }
    });
  }
};
