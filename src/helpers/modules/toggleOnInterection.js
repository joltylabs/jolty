import {
  HOVER,
  FOCUS,
  CLICK,
  EVENT_CLICK,
  EVENT_MOUSEENTER,
  EVENT_MOUSELEAVE,
  EVENT_FOCUSOUT,
  EVENT_FOCUSIN,
} from "../constants";
import { isArray } from "../is";

export default ({
  anchor,
  target,
  instance,
  trigger,
  action = instance.toggle,
  delay,
}) => {
  const { opts, on } = instance;
  trigger ??= opts.trigger;
  delay ??= opts.delay;
  const triggerClick = trigger.includes(CLICK);
  const triggerHover = trigger.includes(HOVER);
  const triggerFocus = trigger.includes(FOCUS);
  const events = [];
  if (triggerHover || triggerFocus) {
    delay = isArray(delay) ? delay : [delay, delay];
  }
  if (triggerClick) {
    on(anchor, EVENT_CLICK, (event) =>
      action(null, { event, trigger: anchor }),
    );
  }
  if (triggerHover) {
    events.push(EVENT_MOUSEENTER, EVENT_MOUSELEAVE);
  }
  if (triggerFocus) {
    events.push(EVENT_FOCUSIN, EVENT_FOCUSOUT);
  }
  if (triggerHover || triggerFocus) {
    on([anchor, target], events, (event) => {
      const { type, target } = event;
      const isFocus = type === EVENT_FOCUSIN || type === EVENT_FOCUSOUT;
      const entered =
        (triggerHover && type === EVENT_MOUSEENTER) ||
        (triggerFocus && type === EVENT_FOCUSIN);
      const d = isFocus ? 0 : delay[entered ? 0 : 1];
      clearTimeout(instance._hoverTimer);
      if (d) {
        instance._hoverTimer = setTimeout(
          () => action(entered, { trigger: anchor, event }),
          d,
        );
      } else {
        action(entered, { event, trigger: target });
      }
    });
  }
};