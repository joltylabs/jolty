import {
  ACTION_PREVENT,
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

const findPreventScrollInstance = () =>
  arrayFrom(Base.allInstances).find(
    (inst) => inst.opts[OPTION_PREVENT_SCROLL] && inst.isOpen,
  );

export default (instance, s) => {
  if (
    (s &&
      instance.opts[OPTION_PREVENT_SCROLL] &&
      !ROOT_ELEM.classList.contains(PREVENT_SCROLL_CLASS)) ||
    (!s && !findPreventScrollInstance())
  ) {
    updateBodyScrollbarWidth(s);
    ROOT_ELEM.classList.toggle(PREVENT_SCROLL_CLASS, s);
  }
};
