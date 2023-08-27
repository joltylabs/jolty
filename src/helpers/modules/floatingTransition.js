import {
  EVENT_SHOW,
  EVENT_HIDE,
  ARROW,
  doc,
  EVENT_SHOWN,
  EVENT_HIDDEN,
  FLOATING,
  EVENT_ACTION_OUTSIDE,
} from "../constants";
import { getDataSelector } from "../utils";
import { addEscapeHide, callAutofocus } from "../modules";
import Floating from "../Floating.js";
import { closest, focus } from "../dom/index.js";

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
      instance[FLOATING] = new Floating({
        base,
        anchor,
        target,
        arrow,
        opts,
        hide: instance.hide,
        defaultTopLayerOpts: instance.constructor.DefaultTopLayer,
        name,
        onTopLayer(type) {
          constructor.dispatchTopLayer(type);
        },
      }).init();
      if (!silent) {
        emit(EVENT_SHOW, eventParams);
      }
    };
  }

  !s && instance[FLOATING]?.wrapper.close?.();

  const promise = transition.run(s, animated, transitionParams);

  if (opts.outsideHide && s) {
    instance.on(doc, EVENT_ACTION_OUTSIDE, (event) => {
      !closest(event.target, [toggler ?? base, target]) &&
        instance.hide({ event });
    });
  } else {
    instance.off(doc, EVENT_ACTION_OUTSIDE);
  }

  if (s) {
    opts.escapeHide && addEscapeHide(instance, s, doc);
    opts.autofocus && callAutofocus(instance);
  } else {
    !s && target.contains(doc.activeElement) && focus(toggler);
  }

  (async () => {
    emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);

    if (s) return;
    if (animated) {
      await promise;
    }
    if (transition.placeholder) {
      instance[FLOATING].wrapper.replaceWith(transition.placeholder);
    }
    instance[FLOATING]?.destroy();
    instance[FLOATING] = null;
  })();

  return promise;
};
