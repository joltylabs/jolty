import { DATA_APPEAR, EVENT_INIT } from "../constants";
import { callOrReturn, checkHash } from "../utils";

export default (instance, elem = instance.base) => {
  const { opts, isShown, show, id } = instance;

  instance.instances.set(id, instance);
  instance.isInit = true;
  instance.emit(EVENT_INIT);

  const shown =
    callOrReturn(
      (opts.hashNavigation && checkHash(id)) || opts.shown,
      instance,
    ) ?? isShown;
  shown &&
    show({
      animated: opts.appear ?? elem.hasAttribute(DATA_APPEAR),
      ignoreConditions: true,
    });

  return instance;
};
