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
  DATA_UI_PREFIX,
  CONFIRM,
  TRIGGER,
  HIDE_MODE,
  TRANSITION,
  PRIVATE_OPTION_CANCEL_ON_HIDE,
  OPTION_PREVENT_SCROLL,
  TOP_LAYER_OPTIONS_NAMES,
  body,
  AUTO,
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
  checkFloatings,
  togglePreventScroll,
  toggleConfirm,
} from "./helpers/modules";
import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";
import {
  addPopoverAttribute,
  destroyTopLayer,
} from "./helpers/modules/toggleTopLayer.js";

class Popover extends ToggleMixin(Base, POPOVER) {
  static [PRIVATE_OPTION_CANCEL_ON_HIDE] = true;
  static Default = {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_FLOATING_OPTIONS,
    eventPrefix: getEventsPrefix(POPOVER),
    autofocus: true,
    interactive: true,
    trigger: CLICK,
    [TOGGLER]: null,
    [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [POPOVER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    confirm: `[${DATA_UI_PREFIX + CONFIRM}],[${
      DATA_UI_PREFIX + CONFIRM
    }="${POPOVER}"]`,
    [OPTION_PREVENT_SCROLL]: AUTO,
  };

  constructor(elem, opts) {
    super(elem, opts);
  }
  init() {
    if (this.isInit) return;

    const { base, opts } = this;

    base.id = this.id;

    this.teleport = new Teleport(base, { disableAttributes: true });

    this._update();

    opts[CONFIRM] && toggleConfirm(this);

    return callShowInit(this);
  }
  _update() {
    const { base, opts } = this;
    updateOptsByData(
      opts,
      base,
      [TRANSITION, HIDE_MODE, TRIGGER, ...TOP_LAYER_OPTIONS_NAMES],
      TOP_LAYER_OPTIONS_NAMES,
    );

    this.transition = Transition.createOrUpdate(
      this.transition,
      base,
      opts.transition,
    );

    this.teleport.opts.to = opts.moveToRoot ? body : null;

    this.updateToggler();

    addPopoverAttribute(this);
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
    const { opts, toggler, base } = this;
    this.emit(EVENT_BEFORE_DESTROY);
    opts.a11y && removeAttribute(toggler, ARIA_CONTROLS, ARIA_EXPANDED);
    removeClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX]);
    removeClass(base, opts[POPOVER + CLASS_ACTIVE_SUFFIX]);
    togglePreventScroll(this, false);
    destroyTopLayer(base);
    return baseDestroy(this, destroyOpts);
  }

  async toggle(s, params) {
    const { isOpen, isAnimating, toggler, base, opts, emit } = this;
    const { awaitAnimation, a11y } = opts;
    const { animated, silent, trigger, event } =
      normalizeToggleParameters(params);

    s ??= !isOpen;

    if ((awaitAnimation && isAnimating) || s === isOpen) return;

    this.isOpen = s;

    if (opts.interactive && checkFloatings(this, s)) return;

    if (isAnimating && !awaitAnimation) {
      await this.transition.cancel();
    }

    const eventParams = { event, trigger };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    a11y && (toggler[ARIA_EXPANDED] = !!s);

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
