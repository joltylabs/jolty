import { APPEAR, EVENT_INIT } from "../constants";
import {
  callOrReturn,
  checkHash,
  getBooleanDataAttrValue,
  isShown,
} from "../utils";

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

  shown &&
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

  return instance;
};
