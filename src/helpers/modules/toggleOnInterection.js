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
} from "../constants";
import { isArray } from "../is";

const PREFIX = UI_EVENT_PREFIX + "-" + TRIGGER;

export default (
  instance,
  {
    toggler = instance.toggler,
    target = instance.base,
    action = instance.toggle,
  } = {},
) => {
  let {
    // eslint-disable-next-line prefer-const
    opts: { trigger, delay, mode },
    // eslint-disable-next-line prefer-const
    on,
  } = instance;

  instance.off([toggler, target], PREFIX);

  if (!trigger) return;

  const triggerClick = trigger.includes(CLICK);
  const triggerHover = mode !== MODAL && trigger.includes(HOVER);
  const triggerFocus = mode !== MODAL && trigger.includes(FOCUS);
  const events = [];
  let isMouseDown = false;
  if (triggerHover) {
    delay = isArray(delay) ? delay : [delay, delay];
  }
  if (triggerClick) {
    on(toggler, EVENT_CLICK + PREFIX, (event) =>
      action(null, { event, trigger: toggler }),
    );
  }
  if (triggerHover) {
    events.push(EVENT_MOUSEENTER + PREFIX, EVENT_MOUSELEAVE + PREFIX);
  }
  if (triggerFocus) {
    events.push(EVENT_FOCUSIN + PREFIX, EVENT_FOCUSOUT + PREFIX);

    triggerClick &&
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
        (type === EVENT_FOCUSOUT && triggerHover && target.matches(":" + HOVER))
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
