import {
  ACTION_REMOVE,
  CLASS,
  doc,
  FLOATING_DATA_ATTRIBUTE,
  HIDDEN,
  HIDDEN_CLASS,
  HIDE_MODE,
  OPTION_HIDDEN_CLASS,
  OPTION_KEEP_PLACE,
  OPTION_SHOWN_CLASS,
  PLACEHOLDER,
  UI_PREFIX,
} from "../constants/index.js";
import { isShown } from "./index.js";
import { removeClass, toggleClass } from "../dom/index.js";

export default (s, instance) => {
  const { base, opts } = instance;
  const mode = opts[HIDE_MODE];
  if (mode === ACTION_REMOVE) {
    if (s) {
      if (opts[OPTION_KEEP_PLACE]) {
        instance[PLACEHOLDER]?.replaceWith(base);
        instance[PLACEHOLDER] = null;
      } else {
        instance._parent?.append(base);
      }
    } else {
      if (opts[OPTION_KEEP_PLACE]) {
        base.replaceWith(
          (instance[PLACEHOLDER] ||= doc.createComment(
            UI_PREFIX + PLACEHOLDER + ":" + base.id,
          )),
        );
      } else {
        const parent = base.parentElement;
        if (parent) {
          instance._parent = parent.hasAttribute(FLOATING_DATA_ATTRIBUTE)
            ? parent.parentElement
            : parent;
          base.remove();
        }
      }
    }
  } else if (mode === CLASS) {
    s ??= !isShown(base);

    if (opts[HIDE_MODE] === CLASS) {
      toggleClass(base, HIDDEN_CLASS, !s);
    }
    opts[OPTION_HIDDEN_CLASS] &&
      toggleClass(base, opts[OPTION_HIDDEN_CLASS], !s);
    opts[OPTION_SHOWN_CLASS] && toggleClass(base, opts[OPTION_SHOWN_CLASS], s);
  } else {
    base.toggleAttribute(mode, !s);
  }
  if (s) {
    base[HIDDEN] = false;
  }
};
