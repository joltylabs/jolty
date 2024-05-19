import {
  ARIA_DESCRIBEDBY,
  ARIA_LABELLEDBY,
  ARIA_SUFFIX,
} from "../constants/index.js";
import { isElement, isString } from "../is/index.js";
import { getOptionElem, uuidGenerator } from "../utils/index.js";
import { setAttribute } from "../dom/index.js";

export default (instance) => {
  const { base, opts } = instance;

  for (const name of [ARIA_LABELLEDBY, ARIA_DESCRIBEDBY]) {
    const suffix = ARIA_SUFFIX[name];
    let elem = opts[suffix];
    if (isString(elem)) {
      elem = getOptionElem(instance, elem, base);
    }
    if (!isElement(elem)) {
      elem = null;
    }

    instance[suffix] = elem;
    if (!elem) return;
    const id = elem ? (elem.id ||= uuidGenerator()) : elem;
    setAttribute(base, name, id);
  }
};
