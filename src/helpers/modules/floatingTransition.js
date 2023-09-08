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
import { getDataSelector, toggleHideModeState } from "../utils";
import { addEscapeHide, callAutofocus } from "../modules";
import Floating from "../Floating.js";
import { closest, focus } from "../dom/index.js";

export default (instance, { s, animated, silent, eventParams }) => {
  const { transition, base, opts, toggler, emit, constructor, teleport } =
    instance;
  const name = constructor.NAME;
  const target = instance[name];
  const anchor = toggler ?? base;

  s && toggleHideModeState(true, instance, target);

  if (s) {
    instance[FLOATING] = new Floating({
      teleport,
      base,
      anchor,
      target,
      arrow: target.querySelector(getDataSelector(name, ARROW)),
      opts,
      hide: instance.hide,
      defaultTopLayerOpts: instance.constructor.DefaultTopLayer,
      name,
      onTopLayer(type) {
        constructor.dispatchTopLayer(type);
      },
    }).init();
  }

  !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

  !s && instance[FLOATING]?.wrapper.close?.();

  const promise = transition?.run(s, animated);

  if (s && opts.outsideHide) {
    instance.on(
      doc,
      EVENT_ACTION_OUTSIDE,
      (event) =>
        !closest(event.target, [toggler ?? base, target]) &&
        instance.hide({ event }),
    );
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
    if (!s) {
      if (animated) {
        await promise;
      }
      if (instance.placeholder) {
        instance[FLOATING].wrapper.replaceWith(instance.placeholder);
      }
      instance[FLOATING]?.destroy();
      instance[FLOATING] = null;
      toggleHideModeState(false, instance, target);
    }
    emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
  })();

  return promise;
};
