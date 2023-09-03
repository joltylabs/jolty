import {
  EVENT_BEFORE_DESTROY,
  EVENT_BEFORE_SHOW,
  EVENT_BEFORE_HIDE,
  CLASS_ACTIVE,
  ARIA_CONTROLS,
  ARIA_EXPANDED,
  POPOVER,
  CLICK,
  DEFAULT_FLOATING_OPTIONS,
  DEFAULT_OPTIONS,
  CLASS_ACTIVE_SUFFIX,
  TOGGLER,
  DEFAULT_TOP_LAYER_OPTIONS,
  OPTION_TOP_LAYER,
  DATA_UI_PREFIX,
  CANCEL,
  CONFIRM,
  EVENT_CLICK,
  UI_EVENT_PREFIX,
  TRIGGER,
  DELAY,
  HIDE_MODE,
} from "./helpers/constants";

import {
  toggleClass,
  removeClass,
  setAttribute,
  removeAttribute,
  closest,
} from "./helpers/dom";
import {
  normalizeToggleParameters,
  getDefaultToggleSelector,
  getOptionElem,
  updateModule,
  getEventsPrefix,
  updateOptsByData,
  upperFirst,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  toggleOnInterection,
  floatingTransition,
  callShowInit,
} from "./helpers/modules";
import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";

const POPOVER_DATA_ATTRIBUTES = [
  [TRIGGER, POPOVER + upperFirst(TRIGGER)],
  [DELAY, POPOVER + upperFirst(DELAY)],
  HIDE_MODE,
];
class Popover extends ToggleMixin(Base, POPOVER) {
  static DefaultTopLayer = {
    ...DEFAULT_TOP_LAYER_OPTIONS,
  };
  static Default = {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_FLOATING_OPTIONS,
    eventPrefix: getEventsPrefix(POPOVER),
    dismiss: true,
    autofocus: true,
    trigger: CLICK,
    [TOGGLER]: null,
    [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [POPOVER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    cancel: `[${DATA_UI_PREFIX + CANCEL}],[${
      DATA_UI_PREFIX + CANCEL
    }="${POPOVER}"]`,
    confirm: `[${DATA_UI_PREFIX + CONFIRM}],[${
      DATA_UI_PREFIX + CONFIRM
    }="${POPOVER}"]`,
  };

  constructor(elem, opts) {
    super(elem, opts);
  }
  init() {
    if (this.isInit) return;
    this._update();

    const { toggler, base } = this;

    toggleOnInterection({
      toggler,
      target: base,
      instance: this,
    });

    addDismiss(this, base);

    this.teleport = new Teleport(
      base,
      {},
      {
        disableAttributes: true,
      },
    );

    return callShowInit(this);
  }
  _update() {
    this.opts = updateOptsByData(this.opts, this.base, POPOVER_DATA_ATTRIBUTES);

    updateModule(this, OPTION_TOP_LAYER);

    const { base, opts, transition } = this;

    this.transition = Transition.createOrUpdate(
      transition,
      base,
      opts.transition,
      { keepPlace: false },
    );

    this.updateToggler();
  }
  updateToggler() {
    const { opts, id } = this;
    const toggler = (this.toggler = getOptionElem(
      this,
      opts.toggler ?? getDefaultToggleSelector(id),
    ));
    if (!toggler) return;
    opts.a11y && setAttribute(toggler, ARIA_CONTROLS, id);
    return this;
  }
  destroy(destroyOpts) {
    if (!this.isInit) return;
    const { opts, toggler } = this;
    this.emit(EVENT_BEFORE_DESTROY);
    opts.a11y && removeAttribute(toggler, ARIA_CONTROLS, ARIA_EXPANDED);
    removeClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX]);
    return baseDestroy(this, destroyOpts);
  }

  async toggle(s, params) {
    const { transition, isShown, isAnimating, toggler, base, opts, emit } =
      this;
    const { awaitAnimation, a11y } = opts;
    const { animated, silent, event, ignoreConditions } =
      normalizeToggleParameters(params);

    s ??= !isShown;

    if (!ignoreConditions && ((awaitAnimation && isAnimating) || s === isShown))
      return;

    this.isShown = s;

    if (isAnimating && !awaitAnimation) {
      await transition?.cancel();
    }

    const eventParams = { event };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    a11y && toggler.setAttribute(ARIA_EXPANDED, !!s);

    if (s) {
      this.on(this.base, EVENT_CLICK + UI_EVENT_PREFIX, (event) => {
        [CANCEL, CONFIRM].forEach((name) => {
          if (opts[name]) {
            const trigger = closest(event.target, opts[name]);
            trigger && emit(name, { event, trigger });
          }
        });
      });
    } else {
      this.off(this.base, EVENT_CLICK + UI_EVENT_PREFIX);
    }

    const promise = floatingTransition(this, {
      s,
      animated,
      silent,
      eventParams,
    });

    toggleClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);
    toggleClass(base, opts[POPOVER + CLASS_ACTIVE_SUFFIX], s);

    animated && awaitAnimation && (await promise);

    return this;
  }
}

export default Popover;
