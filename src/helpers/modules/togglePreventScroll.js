import {
  ACTION_PREVENT,
  doc,
  OPTION_PREVENT_SCROLL,
  PX,
  ROOT,
  ROOT_ELEM,
  SCROLL,
  UI_PREFIX,
  VAR_UI_PREFIX,
  WIDTH,
} from "../constants/index.js";
import { toggleClass } from "../dom/index.js";
import { arrayFrom } from "../utils/index.js";
import Base from "../Base.js";

const PROPERTY_ROOT_SCROLLBAR_WIDTH =
  VAR_UI_PREFIX + ROOT + "-scrollbar-" + WIDTH;

const updateBodyScrollbarWidth = (s) => {
  return s
    ? ROOT_ELEM.style.setProperty(
        PROPERTY_ROOT_SCROLLBAR_WIDTH,
        window.innerWidth - doc.documentElement.clientWidth + PX,
      )
    : ROOT_ELEM.style.removeProperty(PROPERTY_ROOT_SCROLLBAR_WIDTH);
};

export default (instance, s) => {
  const hasPreventScrollInstances = arrayFrom(Base.allInstances).find(
    (instance) => instance.opts[OPTION_PREVENT_SCROLL] && instance.isOpen,
  );
  if ((s && hasPreventScrollInstances) || (!s && !hasPreventScrollInstances)) {
    updateBodyScrollbarWidth(s);
    toggleClass(ROOT_ELEM, UI_PREFIX + ACTION_PREVENT + "-" + SCROLL, s);
  }
};
