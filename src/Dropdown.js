import {
  EVENT_BEFORE_DESTROY,
  EVENT_BEFORE_SHOW,
  EVENT_BEFORE_HIDE,
  EVENT_CLICK,
  EVENT_KEYDOWN,
  CLASS_ACTIVE,
  ARIA_CONTROLS,
  ACTION_REMOVE,
  DROPDOWN,
  CLICK,
  KEY_ENTER,
  KEY_SPACE,
  KEY_END,
  KEY_HOME,
  KEY_ARROW_LEFT,
  KEY_ARROW_UP,
  KEY_ARROW_RIGHT,
  KEY_ARROW_DOWN,
  DEFAULT_FLOATING_OPTIONS,
  DEFAULT_OPTIONS,
  ARIA_EXPANDED,
  KEY_TAB,
  TOGGLER,
  CLASS_ACTIVE_SUFFIX,
  doc,
  HIDE_MODE,
} from "./helpers/constants";

import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import {
  toggleClass,
  removeClass,
  removeAttribute,
  setAttribute,
  closest,
} from "./helpers/dom";
import Transition from "./helpers/Transition.js";
import {
  normalizeToggleParameters,
  isUnfocusable,
  getDataSelector,
  getDefaultToggleSelector,
  getOptionElems,
  getOptionElem,
  updateModule,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  toggleOnInterection,
  floatingTransition,
  callInitShow,
} from "./helpers/modules";

class Dropdown extends ToggleMixin(Base, DROPDOWN) {
  static Default = {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_FLOATING_OPTIONS,
    itemClickHide: true,
    mode: false,
    autofocus: true,
    items: getDataSelector(DROPDOWN + "-item"),
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

    const { toggler, dropdown, show, on } = this;

    toggleOnInterection({ toggler, target: dropdown, instance: this });
    addDismiss(this, dropdown);

    on(dropdown, EVENT_KEYDOWN, this._onKeydown.bind(this));
    on(toggler, EVENT_KEYDOWN, async (event) => {
      const { keyCode } = event;

      const arrowActivated =
        KEY_ARROW_UP === keyCode || KEY_ARROW_DOWN === keyCode;
      if (arrowActivated) {
        event.preventDefault();
      }
      if (arrowActivated) {
        if (!this.isShown) {
          await show({ event, trigger: toggler });
        }
      }
      if (arrowActivated) {
        if (this.isAnimating && !this.isShown) return;
        this.focusableElems[0]?.focus();
      }
    });

    return callInitShow(this, dropdown);
  }
  _update() {
    const { base, opts, transition, on, off, hide } = this;

    this.transition = Transition.createOrUpdate(
      transition,
      base,
      opts.transition,
      { [HIDE_MODE]: ACTION_REMOVE, keepPlace: false },
    );

    this.updateToggler();

    if (opts.itemClickHide) {
      on(base, EVENT_CLICK, (event) => {
        const trigger = closest(event.target, this.focusableElems);
        trigger && hide({ event, trigger });
      });
    } else {
      off(base, EVENT_CLICK);
    }
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
  get focusableElems() {
    return getOptionElems(this, this.opts.items, this.dropdown).filter(
      (elem) => !isUnfocusable(elem),
    );
  }
  _onKeydown(event) {
    const { keyCode } = event;
    const isControl = [
      KEY_ENTER,
      KEY_SPACE,
      KEY_END,
      KEY_HOME,
      KEY_ARROW_LEFT,
      KEY_ARROW_UP,
      KEY_ARROW_RIGHT,
      KEY_ARROW_DOWN,
    ].includes(keyCode);
    const { focusableElems, hide, opts } = this;

    if (!isControl && keyCode !== KEY_TAB) {
      focusableElems
        .find((elem) => elem.textContent.toLowerCase().startsWith(event.key))
        ?.focus();
      return;
    }

    const rtl = false;
    const firstIndex = 0;
    const lastIndex = focusableElems.length - 1;
    const currentIndex = focusableElems.findIndex(
      (elem) => elem === doc.activeElement,
    );

    const nextIndex = currentIndex + 1 > lastIndex ? 0 : currentIndex + 1;
    const prevIndex = currentIndex ? currentIndex - 1 : lastIndex;

    const prevCode = opts.horizontal ? KEY_ARROW_LEFT : KEY_ARROW_UP;
    const nextCode = opts.horizontal ? KEY_ARROW_RIGHT : KEY_ARROW_DOWN;

    if (isControl) {
      event.preventDefault();
      event.stopPropagation();
    }

    switch (event.keyCode) {
      case KEY_ENTER:
      case KEY_SPACE:
        focusableElems[currentIndex].click();
        hide({ event, trigger: event.target });
        break;
      case KEY_END:
        focusableElems[rtl ? firstIndex : lastIndex].focus();
        break;
      case KEY_HOME:
        focusableElems[rtl ? lastIndex : firstIndex].focus();
        break;
      case prevCode:
        focusableElems[rtl ? nextIndex : prevIndex].focus();
        break;
      case nextCode:
        focusableElems[rtl ? prevIndex : nextIndex].focus();
        break;
    }
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
    const { toggler, opts, emit, transition, isShown, isAnimating } = this;
    const { awaitAnimation, a11y } = opts;
    const { animated, silent, trigger, event, ignoreConditions } =
      normalizeToggleParameters(params);

    s ??= !isShown;

    if (!ignoreConditions && ((awaitAnimation && isAnimating) || s === isShown))
      return;

    this.isShown = s;

    if (isAnimating && !awaitAnimation) {
      await transition.cancel();
    }

    const eventParams = { event, trigger };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    a11y && toggler.setAttribute(ARIA_EXPANDED, !!s);

    toggleClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);

    const promise = floatingTransition(this, {
      s,
      animated,
      silent,
      eventParams,
    });

    animated && awaitAnimation && (await promise);

    return this;
  }
}

export default Dropdown;
