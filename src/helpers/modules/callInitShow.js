import { DATA_APPEAR } from "../constants";
import { callOrReturn, checkHash } from "../utils";

export default (instance, elem = instance.base) => {
  const { opts, isShown, show, id } = instance;
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
};
