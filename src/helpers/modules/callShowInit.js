import {
  ACTION_REMOVE,
  DATA_APPEAR,
  EVENT_INIT,
  HIDDEN,
  HIDE_MODE,
} from "../constants";
import {
  callOrReturn,
  checkHash,
  isShown,
  toggleHideModeState,
} from "../utils";

export default (instance, target = instance.base, stateElem = target) => {
  const { opts, show, id } = instance;

  instance.instances.set(id, instance);
  instance.isInit = true;
  instance.emit(EVENT_INIT);

  if (opts[HIDE_MODE] === ACTION_REMOVE && target[HIDDEN]) {
    toggleHideModeState(false, instance, opts);
    target[HIDDEN] = false;
  }

  const shown =
    callOrReturn(
      (opts.hashNavigation && checkHash(id)) || opts.shown,
      instance,
    ) ?? isShown(stateElem, opts.hideMode);

  shown &&
    show({
      animated: opts.appear ?? target.hasAttribute(DATA_APPEAR),
      ignoreConditions: true,
      ignoreAutofocus: true,
    });

  return instance;
};
