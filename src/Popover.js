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
  A11Y,
  DATA_UI_PREFIX,
  OPTION_ARIA_CONTROLS,
  OPTION_ARIA_EXPANDED,
  MODE,
  body,
  doc,
  CLASS_ACTIVE_SUFFIX,
  TOGGLER,
  HIDE_MODE,
} from "./helpers/constants";

import { toggleClass, removeClass, setAttribute, focus } from "./helpers/dom";
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

class Popover extends ToggleMixin(Base, POPOVER) {
  static DefaultA11y = {
    [OPTION_ARIA_CONTROLS]: true,
    [OPTION_ARIA_EXPANDED]: true,
  };
  static DefaultAutofocus = {
    elem: DEFAULT_AUTOFOCUS,
    required: true,
  };
  static Default = {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_FLOATING_OPTIONS,
    focusTrap: true,
    returnFocus: true,
    mode: null,
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
    updateModule(this, A11Y);

    this.transition = Transition.createOrUpdate(
      transition,
      base,
      opts.transition,
      { [HIDE_MODE]: ACTION_REMOVE, keepPlace: false },
    );

    this.updateToggler();

    opts.mode = base.getAttribute(DATA_UI_PREFIX + MODE) ?? opts.mode;
  }
  updateToggler() {
    const { opts, id } = this;
    const toggler = (this.toggler = getOptionElem(
      this,
      opts.toggler ?? getDefaultToggleSelector(id),
    ));
    if (!toggler) return;
    opts.a11y[OPTION_ARIA_CONTROLS] && setAttribute(toggler, ARIA_CONTROLS, id);
    return this;
  }
  destroy(opts) {
    if (!this.isInit) return;
    this.emit(EVENT_BEFORE_DESTROY);
    removeClass(this[TOGGLER], opts[TOGGLER + CLASS_ACTIVE_SUFFIX]);
    return baseDestroy(this, opts);
  }

  async toggle(s, params) {
    const {
      transition,
      isShown,
      isAnimating,
      toggler,
      popover,
      opts,
      emit,
      teleport,
    } = this;
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
      opts.absolute ? toggler.after(popover) : body.appendChild(popover);
    }

    s && teleport?.move(this);

    const eventParams = { event };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    a11y[OPTION_ARIA_EXPANDED] && toggler.setAttribute(ARIA_EXPANDED, !!s);

    toggleClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);

    const promise = floatingTransition(this, {
      s,
      animated,
      silent,
      eventParams,
    });

    !s && returnFocus && popover.contains(doc.activeElement) && focus(toggler);

    s && !ignoreAutofocus && autofocus && callAutofocus(this);

    awaitPromise(promise, () =>
      emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams),
    );

    animated && awaitAnimation && (await promise);

    return this;
  }
}

export default Popover;
