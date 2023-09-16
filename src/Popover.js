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
  OPTION_TOP_LAYER,
  DATA_UI_PREFIX,
  CONFIRM,
  TRIGGER,
  HIDE_MODE,
  TRANSITION,
  PRIVATE_OPTION_CANCEL_ON_HIDE,
} from "./helpers/constants";

import {
  toggleClass,
  removeClass,
  setAttribute,
  removeAttribute,
} from "./helpers/dom";
import {
  normalizeToggleParameters,
  getDefaultToggleSelector,
  getOptionElem,
  getEventsPrefix,
  updateOptsByData,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  toggleOnInterection,
  floatingTransition,
  callShowInit,
  toggleConfirm,
} from "./helpers/modules";
import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";

class Popover extends ToggleMixin(Base, POPOVER) {
  static [PRIVATE_OPTION_CANCEL_ON_HIDE] = true;
  static Default = {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_FLOATING_OPTIONS,
    mode: false,
    eventPrefix: getEventsPrefix(POPOVER),
    dismiss: true,
    autofocus: true,
    trigger: CLICK,
    [TOGGLER]: null,
    [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [POPOVER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
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

    this.teleport = new Teleport(this.base, { disableAttributes: true });

    return callShowInit(this);
  }
  _update() {
    const { base, opts } = this;
    updateOptsByData(opts, base, [TRIGGER, OPTION_TOP_LAYER, HIDE_MODE]);

    this[TRANSITION] = Transition.createOrUpdate(
      this[TRANSITION],
      base,
      opts[TRANSITION],
    );

    this.updateToggler();

    addDismiss(this);
    toggleOnInterection(this);
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
    const { isShown, isAnimating, toggler, base, opts, emit } = this;
    const { awaitAnimation, a11y } = opts;
    const { animated, silent, event, ignoreConditions } =
      normalizeToggleParameters(params);

    s ??= !isShown;

    if (!ignoreConditions && ((awaitAnimation && isAnimating) || s === isShown))
      return;

    this.isShown = s;

    if (isAnimating && !awaitAnimation) {
      await this[TRANSITION].cancel();
    }

    const eventParams = { event, trigger: toggler };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    a11y && toggler.setAttribute(ARIA_EXPANDED, !!s);

    toggleConfirm(s, this);

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
