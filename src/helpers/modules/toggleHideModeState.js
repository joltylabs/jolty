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
        subInstance._floatingParent?.append(target);
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
          subInstance._floatingParent = parent.hasAttribute(
            FLOATING_DATA_ATTRIBUTE,
          )
            ? parent.parentElement
            : parent;
          target.remove();
        }
      }
    }
  } else if (mode !== CLASS) {
    target.toggleAttribute(mode, !s);
  }

  target.classList.toggle(HIDDEN_CLASS, !s && mode === CLASS);

  if (s) {
    target[HIDDEN] = false;
  }
};