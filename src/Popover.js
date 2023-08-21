import {
  EVENT_BEFORE_DESTROY,
  EVENT_BEFORE_SHOW,
  EVENT_SHOWN,
  EVENT_BEFORE_HIDE,
  EVENT_HIDDEN,
  CLASS_ACTIVE,
  ARIA_CONTROLS,
  ARIA_EXPANDED,
  ACTION_REMOVE,
  POPOVER,
  CLICK,
  DEFAULT_AUTOFOCUS,
  DEFAULT_FLOATING_OPTIONS,
  DEFAULT_OPTIONS,
  AUTOFOCUS,
  DATA_UI_PREFIX,
  MODE,
  body,
  doc,
  CLASS_ACTIVE_SUFFIX,
  TOGGLER,
  HIDE_MODE,
  ABSOLUTE,
} from "./helpers/constants";

import {
  toggleClass,
  removeClass,
  setAttribute,
  focus,
  removeAttribute,
} from "./helpers/dom";
import {
  normalizeToggleParameters,
  getDefaultToggleSelector,
  updateModule,
  getOptionElem,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  callAutofocus,
  toggleOnInterection,
  floatingTransition,
  callInitShow,
  awaitPromise,
} from "./helpers/modules";
import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";

// modes POPOVER, DIALOG, FIXED, ABSOLUTE

class Popover extends ToggleMixin(Base, POPOVER) {
  static DefaultAutofocus = {
    elem: DEFAULT_AUTOFOCUS,
    required: true,
  };
  static Default = {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_FLOATING_OPTIONS,
    focusTrap: true,
    returnFocus: true,
    dismiss: true,
    autofocus: true,
    trigger: CLICK,
    [TOGGLER]: null,
    [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
  };

  constructor(elem, opts) {
    super(elem, opts);
  }
  init() {
    if (this.isInit) return;
    this._update();

    const { toggler, popover } = this;

    toggleOnInterection({ anchor: toggler, target: popover, instance: this });
    addDismiss(this, popover);

    return callInitShow(this);
  }
  _update() {
    const { base, opts, transition } = this;

    updateModule(this, AUTOFOCUS);

    this.transition = Transition.createOrUpdate(
      transition,
      base,
      opts.transition,
      { [HIDE_MODE]: ACTION_REMOVE, keepPlace: false },
    );

    this.updateToggler();

    opts[MODE] =
      base.getAttribute(DATA_UI_PREFIX + POPOVER + "-" + MODE) ?? opts[MODE];
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
    const { awaitAnimation, a11y, returnFocus, autofocus } = opts;
    const { animated, silent, event, ignoreAutofocus, ignoreConditions } =
      normalizeToggleParameters(params);

    s ??= !isShown;

    if (!ignoreConditions && ((awaitAnimation && isAnimating) || s === isShown))
      return;

    this.isShown = s;

    if (isAnimating && !awaitAnimation) {
      await transition.cancel();
    }

    if (s) {
      opts[MODE] === ABSOLUTE ? toggler.after(base) : body.appendChild(base);
    }

    const eventParams = { event };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    a11y && toggler.setAttribute(ARIA_EXPANDED, !!s);

    toggleClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);

    const promise = floatingTransition(this, {
      s,
      animated,
      silent,
      eventParams,
    });

    !s && returnFocus && base.contains(doc.activeElement) && focus(toggler);

    s && !ignoreAutofocus && autofocus && callAutofocus(this);

    awaitPromise(promise, () =>
      emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams),
    );

    animated && awaitAnimation && (await promise);

    return this;
  }
}

export default Popover;
