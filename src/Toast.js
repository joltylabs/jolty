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
  ROLE,
  ARIA_LIVE,
  ALERT,
  STATUS,
  ARIA_ATOMIC,
  OPTION_ARIA_LIVE,
  A11Y,
  TABINDEX,
  REGION,
  CLASS_ACTIVE_SUFFIX,
  CLASS_ACTIVE,
} from "./helpers/constants";
import { isArray, isObject, isString } from "./helpers/is";
import { fragment, inDOM, toggleClass } from "./helpers/dom";
import {
  normalizeToggleParameters,
  arrayFrom,
  getEventsPrefix,
  callOrReturn,
  getOptionElem,
  isShown,
  awaitPromise,
} from "./helpers/utils";
import {
  addDismiss,
  toggleHideModeState,
  baseDestroy,
  callShowInit,
  updateModule,
} from "./helpers/modules";
import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Autoaction from "./helpers/Autoaction.js";

const TOAST = "toast";

const positions = {};
const wrappers = new Map();
const _containers = {};

const A11Y_DEFAULTS = {
  [STATUS]: {
    [ROLE]: STATUS,
    [OPTION_ARIA_LIVE]: "polite",
  },
  [ALERT]: {
    [ROLE]: ALERT,
    [OPTION_ARIA_LIVE]: "assertive",
  },
};

class Toast extends ToggleMixin(Base, TOAST) {
  static _templates = {};
  static DefaultA11y = { ...A11Y_DEFAULTS[STATUS] };
  static Default = {
    ...DEFAULT_OPTIONS,
    shown: true,
    eventPrefix: getEventsPrefix(TOAST),
    root: null,
    container: "",
    template: "",
    appear: true,
    dismiss: true,
    limit: false,
    limitAnimateEnter: true,
    limitAnimateLeave: true,
    autohide: false,
    topLayer: true,
    keepTopLayer: true,
    a11y: STATUS,
    [TOAST + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
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

    const { a11y } = updateModule(this, A11Y, false, A11Y_DEFAULTS);

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

    if (a11y) {
      base.setAttribute(ARIA_ATOMIC, true);
      base.setAttribute(ROLE, a11y[ROLE]);
      base.setAttribute(ARIA_LIVE, a11y[OPTION_ARIA_LIVE]);
    }

    addDismiss(this);
  }
  destroy(destroyOpts) {
    if (!this.isInit) return;
    baseDestroy(this, { remove: true, ...destroyOpts });
    return this;
  }
  init() {
    if (this.isInit) return;

    this.base.id = this.id;

    this._update();

    return callShowInit(this);
  }
  async toggle(s, params) {
    const {
      transition,
      opts,
      autohide,
      base,
      root,
      instances,
      constructor,
      emit,
    } = this;
    const { animated, silent, event, trigger } =
      normalizeToggleParameters(params);

    const { limit, position, container, topLayer, keepTopLayer, hideMode } =
      opts;

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
            nots[i - (limit - 1)]?.hide(opts.limitAnimateLeave);
            if (!opts.limitAnimateEnter) {
              preventAnimation = true;
            }
          }
        }
      }
      if (root) {
        let to = root;
        if (position) {
          const wrapper = (to = constructor.getContainer({
            position,
            root,
            container,
            keepTopLayer,
          }));

          if (POPOVER_API_SUPPORTED && topLayer) {
            wrapper[POPOVER] = POPOVER_API_MODE_MANUAL;
          } else {
            wrapper[POPOVER] = null;
          }

          if (wrapper && wrapper.parentElement !== root) {
            root.append(wrapper);
          }
          if (POPOVER_API_SUPPORTED && topLayer) {
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

    toggleClass(base, opts[TOAST + CLASS_ACTIVE_SUFFIX], s);

    awaitPromise(promise, () => {
      !s && toggleHideModeState(false, this);
      !silent && emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
      !s && this.destroy({ remove: true });
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

    this.container = wrapper;

    return this;
  }

  static getContainer({
    position,
    root = body,
    container = "",
    keepTopLayer,
    a11y,
  }) {
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

    if (a11y) {
      wrapper[TABINDEX] = -1;
      wrapper.role = REGION;
    }

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
