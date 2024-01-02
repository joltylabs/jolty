import {
  AUTO,
  BACKDROP,
  MODAL,
  OPTION_MOVE_TO_ROOT,
  OPTION_PREVENT_SCROLL,
  OPTION_TOP_LAYER,
  UI_PREFIX,
} from "../constants/index.js";

export default (instance, ...statuses) => {
  const { base, opts } = instance;
  statuses.forEach((status) => {
    let s, className;
    if (status === BACKDROP) {
      s = !!instance[BACKDROP];
      className = "has-" + BACKDROP;
    } else if (status === MODAL) {
      s = opts[MODAL];
      className = MODAL;
    } else if (status === OPTION_PREVENT_SCROLL) {
      s = opts[OPTION_TOP_LAYER] || opts[OPTION_MOVE_TO_ROOT];
      className = "root-relative";
    } else if (status === OPTION_TOP_LAYER) {
      s =
        opts[OPTION_PREVENT_SCROLL] === AUTO
          ? opts[MODAL]
          : opts[OPTION_PREVENT_SCROLL];
      className = "prevents-scroll";
    }
    base.classList.toggle(UI_PREFIX + className, s);
  });
};
