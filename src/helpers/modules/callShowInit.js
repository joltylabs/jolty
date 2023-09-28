import { APPEAR, EVENT_INIT } from "../constants";
import {
  callOrReturn,
  checkHash,
  getBooleanDataAttrValue,
  isShown,
} from "../utils";
import toggleHideModeState from "./toggleHideModeState.js";

export default (instance, target = instance.base, stateElem = target) => {
  const { opts, show, id } = instance;

  instance.instances.set(id, instance);
  instance.isInit = true;
  instance.emit(EVENT_INIT);

  const shown =
    callOrReturn(
      (opts.hashNavigation && checkHash(id)) || opts.shown,
      instance,
    ) ?? isShown(stateElem, opts.hideMode);

  if (shown) {
    show({
      animated: !!(
        getBooleanDataAttrValue(target, APPEAR) ??
        opts.appear ??
        instance._fromHTML
      ),
      ignoreConditions: true,
      ignoreAutofocus: !instance._fromHTML,
      __initial: true,
    });
  } else {
    toggleHideModeState(false, instance, stateElem);
  }

  return instance;
};
