import { DATA_APPEAR, EVENT_INIT } from "../constants";
import { callOrReturn, checkHash } from "../utils";

export default (instance, elem = instance.base) => {
  const { opts, transition, show, id } = instance;

  instance.instances.set(id, instance);
  instance.isInit = true;
  instance.emit(EVENT_INIT);

  const shown =
    callOrReturn(
      (opts.hashNavigation && checkHash(id)) || opts.shown,
      instance,
    ) ?? transition.isShown;

  shown &&
    show({
      animated: opts.appear ?? elem.hasAttribute(DATA_APPEAR),
      ignoreConditions: true,
      ignoreAutofocus: true,
    });

  return instance;
};
