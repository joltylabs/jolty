import {
  EVENT_INIT,
  EVENT_DESTROY,
  EVENT_BEFORE_SHOW,
  EVENT_SHOW,
  EVENT_SHOWN,
  EVENT_BEFORE_HIDE,
  EVENT_HIDE,
  EVENT_HIDDEN,
  body,
  DEFAULT_OPTIONS,
  DEFAULT,
  ACTION_DESTROY,
  ROLE,
  ARIA_LIVE,
  ARIA_ATOMIC,
  TABINDEX,
  A11Y,
  OPTION_ARIA_LIVE,
  OPTION_ARIA_ATOMIC,
} from "./helpers/constants";
import { isArray, isObject } from "./helpers/is";
import { fragment, inDOM, setAttribute } from "./helpers/dom";
import {
  normalizeToggleParameters,
  arrayFrom,
  objectToAttributes,
  getEventsPrefix,
  updateModule,
} from "./helpers/utils";
import {
  addDismiss,
  awaitPromise,
  baseDestroy,
  callInitShow,
} from "./helpers/modules";
import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Autoaction from "./helpers/Autoaction.js";

const TOAST = "toast";

const positions = {};
const wrappers = new Map();
class Toast extends ToggleMixin(Base, TOAST) {
  static DefaultContainerA11y = {
    containerRole: "region",
    containerTabindex: -1,
  };
  static DefaultA11y = {
    [OPTION_ARIA_LIVE]: "off",
    [OPTION_ARIA_ATOMIC]: true,
    [TABINDEX]: 0,
    [ROLE]: "status",
  };
  static Default = {
    ...DEFAULT_OPTIONS,
    eventPrefix: getEventsPrefix(TOAST),
    root: null,
    container: null,
    appear: true,
    template: null,
    dismiss: true,
    limit: false,
    limitAnimateEnter: true,
    limitAnimateLeave: true,
    autohide: false,
    namespace: DEFAULT,
  };
  static containerName = TOAST + "s";
  constructor(elem, opts) {
    if (isObject(elem)) {
      opts = elem;
      elem = null;
    }
    super({ elem, opts });
  }
  _update() {
    const { opts, base, autohide, hide } = this;
    if (!opts.root && inDOM(base)) {
      this.root = base.parentElement;
    } else {
      this.root = this.getOptionElem(opts.root || body, base);
    }
    this.transition = new Transition(base, opts.transition, {
      hiddenMode: ACTION_DESTROY,
    });
    this.autohide = Autoaction.createOrUpdate(
      autohide,
      base,
      hide,
      opts.autohide,
    );

    const { a11y } = updateModule(this, A11Y);

    a11y[OPTION_ARIA_LIVE] &&
      setAttribute(base, ARIA_LIVE, a11y[OPTION_ARIA_LIVE]);
    a11y[OPTION_ARIA_ATOMIC] && setAttribute(base, ARIA_ATOMIC, true);
    a11y[TABINDEX] && setAttribute(base, TABINDEX, 0);
    a11y[ROLE] && setAttribute(base, ROLE, a11y[ROLE]);
    return this;
  }
  destroy(opts) {
    if (!this.isInit) return;
    baseDestroy(this, { remove: true, ...opts });
    return this;
  }
  init() {
    if (this.isInit) return;

    this._update();

    addDismiss(this);

    return callInitShow(this);
  }
  async toggle(s, params) {
    const {
      transition,
      opts: {
        limit,
        limitAnimateLeave,
        limitAnimateEnter,
        position,
        namespace,
      },
      autohide,
      base,
      root,
      instances,
      constructor,
      emit,
      destroy,
    } = this;
    const { animated, silent, event, trigger } =
      normalizeToggleParameters(params);

    if (animated && transition.isAnimating) return;

    s ??= !transition.isShown;

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
            namespace,
          }));
          if (wrapper && wrapper.parentElement !== root) {
            root.append(wrapper);
          }
        }
        to.append(base);
      }
    }

    const eventParams = { event, trigger };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    autohide && autohide.toggleInterections(s);

    const promise = transition.run(s, animated && !preventAnimation, {
      [s ? EVENT_SHOW : EVENT_HIDE]: () =>
        !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams),
      [EVENT_DESTROY]: () =>
        destroy({ remove: true, destroyTransition: false }),
    });

    awaitPromise(promise, () =>
      emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams),
    );

    animated && (await promise);

    const rootWrappers = wrappers.get(root);
    const wrapper =
      rootWrappers &&
      [...rootWrappers].find(
        (w) => w.position === position && w.namespace === namespace,
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

  static getWrapper({ position, root = body, namespace = DEFAULT }) {
    let rootWrappers = wrappers.get(root);
    if (!rootWrappers) {
      rootWrappers = new Set();
      wrappers.set(root, rootWrappers);
    } else {
      const wrapper = [...rootWrappers].find(
        (w) => w.position === position && w.namespace === namespace,
      );
      if (wrapper) return wrapper.wrapper;
    }
    const a11y = this.DefaultContainerA11y;
    const attributes = objectToAttributes({
      role: a11y.containerRole,
      tabindex: a11y.containerTabindex,
    });
    const wrapper = fragment(
      this.Default.container({ position, namespace, attributes }),
    );

    rootWrappers.add({ wrapper, namespace, position, root });
    return wrapper;
  }
  static addPosition(position, namespace = DEFAULT) {
    positions[namespace] ||= {};
    if (isArray(position)) {
      position.forEach((p) => this.addPosition(p, namespace));
    } else if (isObject(position)) {
      positions[namespace][position.name] = position;
    }
  }
}

export default Toast;
