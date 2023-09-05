import {
  ACTION_REMOVE,
  CLASS,
  doc,
  FLOATING_DATA_ATTRIBUTE,
  HIDDEN,
  HIDDEN_CLASS,
  HIDE_MODE,
  PLACEHOLDER,
  UI_PREFIX,
} from "../constants/index.js";
import { isShown } from "./index.js";
import { toggleClass } from "../dom/index.js";

export default (
  s,
  instance,
  target = instance.base,
  subInstance = instance,
) => {
  const opts = instance.opts;
  const mode = opts[HIDE_MODE];
  if (mode === ACTION_REMOVE) {
    if (s) {
      if (opts.keepPlace) {
        subInstance[PLACEHOLDER]?.replaceWith(target);
        subInstance[PLACEHOLDER] = null;
      } else {
        subInstance._parent?.append(target);
      }
    } else {
      if (opts.keepPlace) {
        target.replaceWith(
          (subInstance[PLACEHOLDER] ||= doc.createComment(
            UI_PREFIX + PLACEHOLDER + ":" + target.id,
          )),
        );
      } else {
        const parent = target.parentElement;
        if (parent) {
          subInstance._parent = parent.hasAttribute(FLOATING_DATA_ATTRIBUTE)
            ? parent.parentElement
            : parent;
          target.remove();
        }
      }
    }
  } else if (mode === CLASS) {
    toggleClass(target, HIDDEN_CLASS, !s);
  } else {
    target.toggleAttribute(mode, !s);
  }
  if (s) {
    target[HIDDEN] = false;
  }
};
