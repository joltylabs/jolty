import {
  EVENT_INIT,
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
  FOCUSABLE_ELEMENTS_SELECTOR,
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
} from "./helpers/constants";

import { toggleClass, removeClass, setAttribute, focus } from "./helpers/dom";
import {
  normalizeToggleParameters,
  getDefaultToggleSelector,
  updateModule,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  callAutofocus,
  toggleOnInterection,
  floatingTransition,
  callInitShow,
} from "./helpers/modules";
import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";

class Popover extends ToggleMixin(Base, POPOVER) {
  static DefaultA11y = {
    [OPTION_ARIA_CONTROLS]: true,
    [OPTION_ARIA_EXPANDED]: true,
  };
  static DefaultAutofocus = {
    elem: DEFAULT_AUTOFOCUS,
    required: true,
    focusableElements: FOCUSABLE_ELEMENTS_SELECTOR,
  };
  static Default = {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_FLOATING_OPTIONS,
    topLayer: true,
    returnFocus: true,
    mode: false,
    dismiss: true,
    autofocus: true,
    trigger: CLICK,
    [TOGGLER]: null,
    [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
  };

  constructor(elem, opts = {}) {
    super({ opts, elem });
  }
  init() {
    if (this.isInit) return;
    this._update();

    const { toggler, id, instances, popover, emit } = this;

    instances.set(id, this);

    toggleOnInterection({ anchor: toggler, target: popover, instance: this });
    addDismiss(this, popover);

    this.isInit = true;

    emit(EVENT_INIT);

    callInitShow(this);

    return this;
  }
  _update() {
    const { base, opts, transition, teleport } = this;

    updateModule(this, AUTOFOCUS);
    updateModule(this, A11Y);

    this.teleport = Teleport.createOrUpdate(
      teleport,
      base,
      opts.teleport ?? (opts.absolute ? base.parentNode : body),
    );
    this.transition = Transition.createOrUpdate(
      transition,
      base,
      opts.transition,
      { hiddenMode: ACTION_REMOVE, keepPlace: false },
    );

    this.updateToggler();

    opts.mode = base.getAttribute(DATA_UI_PREFIX + MODE) ?? opts.mode;
  }
  updateToggler() {
    const { opts, id, getOptionElem } = this;
    const toggler = (this.toggler = getOptionElem(
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
      isEntering,
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

    s ??= !isEntering;

    if (
      !ignoreConditions &&
      ((awaitAnimation && isAnimating) || s === isEntering)
    )
      return;

    if (isAnimating && !awaitAnimation) {
      await Promise.allSettled([transition.cancel()]);
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

    animated && awaitAnimation && (await promise);

    s && !ignoreAutofocus && autofocus && callAutofocus(this);

    !silent && emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);

    return this;
  }
}

export default Popover;
