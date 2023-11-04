import {
  ACTION_PREVENT,
  AUTO,
  OPTION_PREVENT_SCROLL,
  PX,
  ROOT,
  ROOT_ELEM,
  SCROLL,
  UI_PREFIX,
  VAR_UI_PREFIX,
  WIDTH,
} from "../constants/index.js";
import { arrayFrom } from "../utils/index.js";
import Base from "../Base.js";
import { isModal } from "../is/index.js";

const PROPERTY_ROOT_SCROLLBAR_WIDTH =
  VAR_UI_PREFIX + ROOT + "-scrollbar-" + WIDTH;

const PREVENT_SCROLL_CLASS = UI_PREFIX + ACTION_PREVENT + "-" + SCROLL;
const updateBodyScrollbarWidth = (s) => {
  return s
    ? ROOT_ELEM.style.setProperty(
        PROPERTY_ROOT_SCROLLBAR_WIDTH,
        window.innerWidth - ROOT_ELEM.clientWidth + PX,
      )
    : ROOT_ELEM.style.removeProperty(PROPERTY_ROOT_SCROLLBAR_WIDTH);
};

const checkPreventScroll = (instance) => {
  const preventScrollOption = instance.opts[OPTION_PREVENT_SCROLL];
  if (!instance.isOpen) return;
  return preventScrollOption === AUTO
    ? isModal(instance.base)
    : preventScrollOption;
};

export default (instance, s) => {
  if (
    (s &&
      checkPreventScroll(instance) &&
      !ROOT_ELEM.classList.contains(PREVENT_SCROLL_CLASS)) ||
    (!s && !arrayFrom(Base.allInstances).find(checkPreventScroll))
  ) {
    updateBodyScrollbarWidth(s);
    ROOT_ELEM.classList.toggle(PREVENT_SCROLL_CLASS, s);
  }
};
