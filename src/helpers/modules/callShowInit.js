import { APPEAR, EVENT_INIT } from "../constants";
import {
  callOrReturn,
  checkHash,
  getBooleanDataAttrValue,
  isShown,
} from "../utils";
import toggleStateMode from "./toggleStateMode.js";
import { toggleInitClass } from "./index.js";

export default (instance, target = instance.base, stateElem = target) => {
  const { opts, show, id } = instance;

  instance.instances.set(id, instance);
  instance.isInit = true;
  toggleInitClass(instance, true);
  instance._emit(EVENT_INIT);

  const shown =
    callOrReturn(
      (opts.hashNavigation && checkHash(id)) || opts.shown,
      instance,
    ) ?? isShown(stateElem, opts.stateMode);

  if (shown) {
    show({
      animated: !!(
        getBooleanDataAttrValue(target, APPEAR) ??
        opts.appear ??
        instance._fromHTML
      ),
      __initial: true,
    });
  } else {
    toggleStateMode(false, instance, stateElem);
  }

  return instance;
};
