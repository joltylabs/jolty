import { doc, EVENT_ACTION_OUTSIDE } from "../constants";
import { closest } from "../dom";

export default (instance, s, activeElems) => {
  if (s) {
    instance.on(doc, EVENT_ACTION_OUTSIDE, (event) => {
      !closest(event.target, activeElems) && instance.hide({ event });
    });
  } else {
    instance.off(doc, EVENT_ACTION_OUTSIDE);
  }
};
