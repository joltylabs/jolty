import {
  ACTION_DESTROY,
  ACTION_REMOVE,
  CLASS,
  doc,
  FLOATING_DATA_ATTRIBUTE,
  HIDE_MODE,
  OPTION_KEEP_PLACE,
  PLACEHOLDER,
  UI_PREFIX,
} from "../constants/index.js";

export default (s, instance, opts = instance.opts) => {
  const base = instance.base;
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
  } else if (mode !== ACTION_DESTROY && mode !== CLASS) {
    base.toggleAttribute(mode, !s);
  }
};
