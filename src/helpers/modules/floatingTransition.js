import { EVENT_SHOW, EVENT_HIDE, ARROW, doc } from "../constants";
import { getDataSelector } from "../utils";
import { addOutsideHide, addEscapeHide } from "../modules";
import Floating from "../Floating.js";

export default (instance, { s, animated, silent, eventParams }) => {
  const { transition, base, opts, toggler, emit, constructor } = instance;
  const name = constructor.NAME;
  const target = instance[name];
  const anchor = toggler ?? base;
  const transitionParams = { allowRemove: false };
  transition.parent = null;

  if (!silent && !s) {
    emit(EVENT_HIDE, eventParams);
  }

  if (s) {
    transitionParams[EVENT_SHOW] = () => {
      const arrow = target.querySelector(getDataSelector(name, ARROW));
      instance.floating = new Floating({
        base,
        anchor,
        target,
        arrow,
        opts,
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

  !s &&
    (async () => {
      if (animated) {
        await promise;
      }
      if (transition.placeholder) {
        instance.floating.wrapper.replaceWith(transition.placeholder);
      }
      instance.floating?.destroy();
      instance.floating = null;
    })();

  return promise;
};
