import {
  EVENT_BEFORE_SHOW,
  EVENT_SHOW,
  EVENT_SHOWN,
  EVENT_BEFORE_HIDE,
  EVENT_HIDE,
  EVENT_HIDDEN,
  DEFAULT_OPTIONS,
  STATE_MODE,
  POPOVER_API_MODE_MANUAL,
  POPOVER,
  ACTION_REMOVE,
  HIDDEN,
  ROLE,
  ARIA_LIVE,
  ALERT,
  STATUS,
  ARIA_ATOMIC,
  A11Y,
  TABINDEX,
  REGION,
  CLASS_ACTIVE_SUFFIX,
  CLASS_ACTIVE,
  DISMISS,
  UI_PREFIX,
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
  isPopoverApiSupported,
} from "./helpers/utils";
import {
  addDismiss,
  toggleStateMode,
  baseDestroy,
  callShowInit,
  updateModule,
} from "./helpers/modules";
import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Autoaction from "./helpers/Autoaction.js";

const TOAST = "toast";
const TOASTS = UI_PREFIX + "toasts";

const positions = {};
const wrappers = new Map();
const _containers = {
  "": ({ position, name }) => {
    const nameClass = name ? TOASTS + `--${name}` : "";
    const positionClass = position ? TOASTS + `--${position}` : "";
    return `<div class="${TOASTS} ${nameClass} ${positionClass}"></div>`;
  },
};

const A11Y_DEFAULTS = {
  [STATUS]: {
    [ROLE]: STATUS,
    [ARIA_LIVE]: "polite",
  },
  [ALERT]: {
    [ROLE]: ALERT,
    [ARIA_LIVE]: "assertive",
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
    limit: false,
    limitAnimateEnter: true,
    limitAnimateLeave: false,
    autohide: 5000,
    topLayer: true,
    keepTopLayer: false,
    a11y: STATUS,
    position: "top-end",
    [TOAST + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
  };
  constructor(elem, opts) {
    if (isObject(elem)) {
      opts = elem;
      elem = null;
    }
    super(elem, opts);
  }
  init() {
    if (this.isInit) return;

    this.base.id = this.id;

    this._update();

    this.opts[DISMISS] && addDismiss(this);

    return callShowInit(this);
  }
  _update() {
    const { opts, base, autohide, hide } = this;

    const { a11y } = updateModule(this, A11Y, false, A11Y_DEFAULTS);

    if (!opts.root && inDOM(base)) {
      this.root = base.parentElement;
    } else {
      this.root = opts.root ? getOptionElem(this, opts.root) : document.body;
    }
    if (opts[STATE_MODE] === ACTION_REMOVE && base[HIDDEN]) {
      toggleStateMode(false, this);
    }

    this.transition = Transition.createOrUpdate(
      this.transition,
      base,
      opts.transition,
    );
    this.autohide = Autoaction.createOrUpdate(
      autohide,
      base,
      hide,
      opts.autohide,
    );

    if (a11y) {
      base[ARIA_ATOMIC] = true;
      base[ROLE] = a11y[ROLE];
      base[ARIA_LIVE] = a11y[ARIA_LIVE];
    }
  }
  destroy(destroyOpts) {
    if (!this.isInit) return;
    baseDestroy(this, { remove: true, ...destroyOpts });
    return this;
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
      _emit,
    } = this;
    const { animated, silent, event, trigger } =
      normalizeToggleParameters(params);

    const { limit, position, container, topLayer, keepTopLayer, stateMode } =
      opts;

    s ??= !isShown(base, stateMode);

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

          if (isPopoverApiSupported && topLayer) {
            wrapper[POPOVER] = POPOVER_API_MODE_MANUAL;
          } else {
            wrapper[POPOVER] = null;
          }

          if (wrapper && wrapper.parentElement !== root) {
            root.append(wrapper);
          }
          if (isPopoverApiSupported && topLayer) {
            wrapper.hidePopover();
            wrapper.showPopover();
          }
        }
        to.append(base);
      }
    }

    const eventParams = { event, trigger };

    !silent && _emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    autohide && autohide.toggleInterections(s);

    s && toggleStateMode(true, this);

    !silent && _emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

    const promise = transition?.run(s, animated && !preventAnimation);

    toggleClass(base, opts[TOAST + CLASS_ACTIVE_SUFFIX], s);

    awaitPromise(promise, () => {
      !s && toggleStateMode(false, this);
      !silent && _emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
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
    root = document.body,
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
      wrapper.setAttribute(TABINDEX, -1);
      wrapper[ROLE] = REGION;
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
          isPopoverApiSupported() &&
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
