import {
  EVENT_DESTROY,
  FLOATING,
  HIDDEN,
  HIDDEN_CLASS,
  INERT,
  PLACEHOLDER,
  SHOWN_CLASS,
  TELEPORT,
  TRANSITION,
} from "../constants";
import { removeAttribute, removeClass } from "../dom/index.js";
import { destroyInstance, toggleInitClass } from "./index.js";

export default (
  instance,
  { remove = false, keepInstance = false, keepState = false } = {},
) => {
  const { base, _off, _emit, constructor } = instance;

  const stateElem = instance[constructor.NAME];

  instance[PLACEHOLDER]?.replaceWith(base);

  ["autohide", FLOATING, TRANSITION, TELEPORT].forEach((key) => {
    if (instance[key]) {
      instance[key].destroy();
      instance[key] = null;
    }
  });

  _off();

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

  toggleInitClass(instance, false);

  _emit(EVENT_DESTROY);

  return instance;
};
