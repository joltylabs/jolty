import { doc, EVENT_ACTION_OUTSIDE, EVENT_FOCUS, FLOATING } from "../constants";
import { closest } from "../dom";

export default (instance, s, activeElems) => {
  const { focusGuards, anchor } = instance[FLOATING] ?? {};
  if (s) {
    if (focusGuards) {
      instance.on(focusGuards, EVENT_FOCUS, (event) => {
        instance.hide({ event });
        anchor.focus();
      });
    }
    instance.on(doc, EVENT_ACTION_OUTSIDE, (event) => {
      !closest(event.target, activeElems) && instance.hide({ event });
    });
  } else {
    instance.off(doc, EVENT_ACTION_OUTSIDE);
    if (focusGuards) {
      instance.off(focusGuards, EVENT_ACTION_OUTSIDE);
    }
  }
};
