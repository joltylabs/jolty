import { EVENT_SHOW, EVENT_HIDE, ARROW, doc } from "../constants";
import { getDataSelector } from "../utils";
import { addOutsideHide, addEscapeHide } from "../modules";
import Floating from "../Floating.js";

export default (instance, { s, animated, silent, eventParams }) => {
  const { transition, base, opts, toggler, emit, floating, constructor } =
    instance;
  const name = constructor.NAME;
  const target = instance[name];
  const transitionParams = { allowRemove: false };
  transition.parent = null;

  if (!silent && !s) {
    emit(EVENT_HIDE, eventParams);
  }

  if (s) {
    transitionParams[EVENT_SHOW] = () => {
      const root = target.parentNode;
      const arrow = target.querySelector(getDataSelector(name, ARROW));

      instance.floating = new Floating({
        anchor: toggler ?? base,
        target,
        arrow,
        opts,
        root,
        name,
      }).recalculate();
      if (!silent) {
        emit(EVENT_SHOW, eventParams);
      }
    };
  }

  !s && instance?.floating?.wrapper.close?.();

  const promise = transition.run(s, animated, transitionParams);

  if (s) {
    opts.outsideHide && addOutsideHide(instance, s, [toggler ?? base, target]);
    opts.escapeHide && addEscapeHide(instance, s, doc);
  }

  (async () => {
    await promise;
    if (!s) {
      if (transition.placeholder) {
        floating.wrapper.replaceWith(transition.placeholder);
      }
      floating?.destroy();
      instance.floating = null;
    }
  })();

  return promise;
};
