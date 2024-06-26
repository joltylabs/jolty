import {
  ACTION_PREVENT,
  AUTO,
  MODAL,
  OPTION_PREVENT_SCROLL,
  PX,
  ROOT,
  SCROLL,
  UI_PREFIX,
  VAR_UI_PREFIX,
  WIDTH,
} from "../constants/index.js";
import { arrayFrom } from "../utils/index.js";
import Base from "../Base.js";

const PROPERTY_ROOT_SCROLLBAR_WIDTH =
  VAR_UI_PREFIX + ROOT + "-scrollbar-" + WIDTH;

const PREVENT_SCROLL_CLASS = UI_PREFIX + ACTION_PREVENT + "-" + SCROLL;
const updateBodyScrollbarWidth = (s) => {
  return s
    ? document.documentElement.style.setProperty(
        PROPERTY_ROOT_SCROLLBAR_WIDTH,
        window.innerWidth - document.documentElement.clientWidth + PX,
      )
    : document.documentElement.style.removeProperty(
        PROPERTY_ROOT_SCROLLBAR_WIDTH,
      );
};

const checkPreventScroll = (instance) => {
  const preventScrollOption = instance.opts[OPTION_PREVENT_SCROLL];
  if (!instance.isOpen) return;
  return preventScrollOption === AUTO
    ? instance.opts[MODAL]
    : preventScrollOption;
};

export default (instance, s) => {
  if (
    (s &&
      checkPreventScroll(instance) &&
      !document.documentElement.classList.contains(PREVENT_SCROLL_CLASS)) ||
    (!s && !arrayFrom(Base.allInstances).find(checkPreventScroll))
  ) {
    updateBodyScrollbarWidth(s);
    document.documentElement.classList.toggle(PREVENT_SCROLL_CLASS, s);
  }
};
