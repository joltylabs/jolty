import {
  EVENT_DESTROY,
  FLOATING,
  HIDDEN,
  HIDDEN_CLASS,
  ID,
  INERT,
  PLACEHOLDER,
  SHOWN_CLASS,
  TELEPORT,
  TRANSITION,
} from "../constants";
import { removeAttribute, removeClass } from "../dom/index.js";
import { destroyInstance } from "./index.js";

export default (
  instance,
  { remove = false, keepInstance = false, keepState = false } = {},
) => {
  const { base, off, emit, constructor } = instance;

  const stateElem = instance[constructor.NAME];

  instance[PLACEHOLDER]?.replaceWith(base);

  ["autohide", FLOATING, TRANSITION, TELEPORT].forEach((key) => {
    if (instance[key]) {
      instance[key].destroy();
      instance[key] = null;
    }
  });

  off();

  if (!keepInstance) {
    destroyInstance(instance);
  }
  if (remove) {
    base.remove();
  } else if (!keepState) {
    removeClass(stateElem, [HIDDEN_CLASS, SHOWN_CLASS]);
    removeAttribute(stateElem, HIDDEN, INERT);
  }

  instance.isInit = false;

  emit(EVENT_DESTROY);

  return instance;
};
