import { DATA_APPEAR, EVENT_INIT } from "../constants";
import { callOrReturn, checkHash, isShown } from "../utils";

export default (instance, elem = instance.base, stateElem = elem) => {
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
      animated: opts.appear ?? elem.hasAttribute(DATA_APPEAR),
      ignoreConditions: true,
      ignoreAutofocus: true,
    });

  return instance;
};
