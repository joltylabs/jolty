import { ACTION_INIT, UI_PREFIX } from "../constants/index.js";

export default (instance, s) => {
  instance.base.classList.toggle(
    UI_PREFIX + instance.constructor.NAME + "-" + ACTION_INIT,
    s,
  );
};
