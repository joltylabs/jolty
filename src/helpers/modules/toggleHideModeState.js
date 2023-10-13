import {
  ACTION_REMOVE,
  CLASS_HIDDEN_MODE,
  CLASS_SHOWN_MODE,
  doc,
  EVENT_BEFORE_MATCH,
  FLOATING_DATA_ATTRIBUTE,
  HIDDEN,
  HIDDEN_CLASS,
  HIDE_MODE,
  MODE_HIDDEN_UNTIL_FOUND,
  PLACEHOLDER,
  SHOWN_CLASS,
  UI_PREFIX,
  UNTIL_FOUND,
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
  } else if (mode !== CLASS_HIDDEN_MODE && mode !== CLASS_SHOWN_MODE) {
    if (mode === MODE_HIDDEN_UNTIL_FOUND) {
      if (s) {
        target.removeAttribute(HIDDEN);
        instance.off(target, EVENT_BEFORE_MATCH);
      } else {
        target.setAttribute(HIDDEN, UNTIL_FOUND);
        instance.on(target, EVENT_BEFORE_MATCH, (event) => {
          instance.show(target, { animated: false, event });
        });
      }
    } else {
      target.toggleAttribute(mode, !s);
    }
  }

  target.classList.toggle(HIDDEN_CLASS, !s && mode === CLASS_HIDDEN_MODE);
  target.classList.toggle(SHOWN_CLASS, s && mode === CLASS_SHOWN_MODE);

  if (s) {
    target[HIDDEN] = false;
  }
};
