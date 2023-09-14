import {
  EVENT_BEFORE_SHOW,
  EVENT_SHOW,
  EVENT_SHOWN,
  EVENT_BEFORE_HIDE,
  EVENT_HIDE,
  EVENT_HIDDEN,
  body,
  DEFAULT_OPTIONS,
  HIDE_MODE,
  POPOVER_API_SUPPORTED,
  POPOVER_API_MODE_MANUAL,
  POPOVER,
  ACTION_REMOVE,
  HIDDEN,
  TRANSITION,
} from "./helpers/constants";
import { isArray, isObject, isString } from "./helpers/is";
import { fragment, inDOM } from "./helpers/dom";
import {
  normalizeToggleParameters,
  arrayFrom,
  getEventsPrefix,
  callOrReturn,
  getOptionElem,
  isShown,
  toggleHideModeState,
} from "./helpers/utils";
import {
  addDismiss,
  awaitPromise,
  baseDestroy,
  callShowInit,
} from "./helpers/modules";
import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Autoaction from "./helpers/Autoaction.js";

const TOAST = "toast";

const positions = {};
const wrappers = new Map();
const _containers = {};
class Toast extends ToggleMixin(Base, TOAST) {
  static _templates = {};

  static Default = {
    ...DEFAULT_OPTIONS,
    eventPrefix: getEventsPrefix(TOAST),
    root: null,
    container: "",
    template: "",
    appear: true,
    dismiss: true,
    limit: false,
    limitAnimateEnter: true,
    limitAnimateLeave: true,
    autodestroy: true,
    autohide: false,
    topLayer: true,
    keepTopLayer: true,
    popoverApi: true,
    shown: true,
  };
  constructor(elem, opts) {
    if (isObject(elem)) {
      opts = elem;
      elem = null;
    }
    super(elem, opts);
  }
  _update() {
    const { opts, base, autohide, hide } = this;
    if (!opts.root && inDOM(base)) {
      this.root = base.parentElement;
    } else {
      this.root = opts.root ? getOptionElem(this, opts.root) : body;
    }
    if (opts[HIDE_MODE] === ACTION_REMOVE && base[HIDDEN]) {
      toggleHideModeState(false, this);
    }

    this[TRANSITION] = Transition.createOrUpdate(
      this[TRANSITION],
      base,
      opts[TRANSITION],
    );
    this.autohide = Autoaction.createOrUpdate(
      autohide,
      base,
      hide,
      opts.autohide,
    );

    addDismiss(this);
  }
  destroy(destroyOpts) {
    if (!this.isInit) return;
    baseDestroy(this, { remove: true, ...destroyOpts });
    return this;
  }
  init() {
    if (this.isInit) return;

    this._update();

    return callShowInit(this);
  }
  async toggle(s, params) {
    const {
      transition,
      opts: {
        limit,
        limitAnimateLeave,
        limitAnimateEnter,
        position,
        container,
        popoverApi,
        topLayer,
        keepTopLayer,
        hideMode,
        autodestroy,
      },
      autohide,
      base,
      root,
      instances,
      constructor,
      emit,
    } = this;
    const { animated, silent, event, trigger } =
      normalizeToggleParameters(params);

    if (animated && transition?.isAnimating) return;

    s ??= !isShown(base, hideMode);

    let preventAnimation;

    if (s) {
      if (limit) {
        const nots = arrayFrom(instances.values()).filter(
          (instance) =>
            instance !== this &&
            instance.opts.position === position &&
            instance.root === root,
        );
        for (let i = 0; i < nots.length; i++) {
          if (i >= limit - 1) {
            nots[i - (limit - 1)]?.hide(limitAnimateLeave);
            if (!limitAnimateEnter) {
              preventAnimation = true;
            }
          }
        }
      }
      if (root) {
        let to = root;
        if (position) {
          const wrapper = (to = constructor.getWrapper({
            position,
            root,
            container,
            keepTopLayer,
          }));

          if (POPOVER_API_SUPPORTED && popoverApi && topLayer) {
            wrapper[POPOVER] = POPOVER_API_MODE_MANUAL;
          } else {
            wrapper[POPOVER] = null;
          }

          if (wrapper && wrapper.parentElement !== root) {
            root.append(wrapper);
          }
          if (POPOVER_API_SUPPORTED && popoverApi && topLayer) {
            wrapper.hidePopover();
            wrapper.showPopover();
          }
        }
        to.append(base);
      }
    }

    const eventParams = { event, trigger };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    autohide && autohide.toggleInterections(s);

    s && toggleHideModeState(true, this);

    !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

    const promise = transition?.run(s, animated && !preventAnimation);

    awaitPromise(promise, () => {
      !s && toggleHideModeState(false, this);
      !silent && emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
      !s && autodestroy && this.destroy({ remove: true });
    });

    animated && (await promise);

    const rootWrappers = wrappers.get(root);
    const wrapper =
      rootWrappers &&
      [...rootWrappers].find(
        (w) => w.position === position && w.container === container,
      )?.wrapper;

    if (!s && wrapper && !wrapper.children.length) {
      if (rootWrappers) {
        const w = [...rootWrappers].find((w) => w.wrapper === wrapper);
        w && rootWrappers.delete(w);
      }
      wrapper.remove();
    }

    return this;
  }

  static getWrapper({ position, root = body, container = "", keepTopLayer }) {
    let rootWrappers = wrappers.get(root);
    if (!rootWrappers) {
      rootWrappers = new Set();
      wrappers.set(root, rootWrappers);
    } else {
      const wrapper = [...rootWrappers].find(
        (w) => w.position === position && w.container === container,
      );
      if (wrapper) return wrapper.wrapper;
    }

    const containerParams = { name: container, position };
    const wrapper = fragment(
      isString(container)
        ? callOrReturn(
            _containers[container] ?? _containers[""],
            containerParams,
          )
        : container(containerParams),
    );

    rootWrappers.add({ wrapper, container, position, root, keepTopLayer });
    return wrapper;
  }
  static addPosition(position, container = "") {
    positions[container] ||= {};
    if (isArray(position)) {
      position.forEach((p) => this.addPosition(p, container));
    } else if (isObject(position)) {
      positions[container][position.name] = position;
    }
  }
  static template(name, opts) {
    if (!opts) {
      opts = name;
      name = "";
    }
    if (!opts) return this._templates[name];
    this._templates[name] = opts;
    return this;
  }
  static container(name, opts) {
    if (!opts) {
      opts = name;
      name = "";
    }
    if (!opts) return _containers[name];
    _containers[name] = opts;
    return this;
  }
  static forceTopLayer() {
    [...wrappers.values()].forEach((set) => {
      set.forEach(({ wrapper, root, keepTopLayer }) => {
        if (
          keepTopLayer &&
          POPOVER_API_SUPPORTED &&
          wrapper.popover &&
          root.contains(wrapper)
        ) {
          wrapper.hidePopover();
          wrapper.showPopover();
        }
      });
    });
  }
}

export default Toast;
