import {
  EVENT_BEFORE_DESTROY,
  EVENT_BEFORE_SHOW,
  EVENT_SHOWN,
  EVENT_BEFORE_HIDE,
  EVENT_HIDDEN,
  EVENT_CLICK,
  EVENT_KEYDOWN,
  CLASS_ACTIVE,
  ARIA_CONTROLS,
  ACTION_REMOVE,
  DROPDOWN,
  CLICK,
  DATA_UI_PREFIX,
  KEY_ENTER,
  KEY_SPACE,
  KEY_END,
  KEY_HOME,
  KEY_ARROW_LEFT,
  KEY_ARROW_UP,
  KEY_ARROW_RIGHT,
  KEY_ARROW_DOWN,
  DEFAULT_AUTOFOCUS,
  DEFAULT_FLOATING_OPTIONS,
  DEFAULT_OPTIONS,
  OPTION_ARIA_CONTROLS,
  OPTION_ARIA_EXPANDED,
  ARIA_EXPANDED,
  KEY_TAB,
  MODE,
  body,
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
  removeAttr,
  setAttribute,
  closest,
} from "./helpers/dom";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";
import {
  normalizeToggleParameters,
  isUnfocusable,
  getDataSelector,
  getDefaultToggleSelector,
  getOptionElems,
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

class Dropdown extends ToggleMixin(Base, DROPDOWN) {
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

    const { opts, toggler, dropdown, show, on } = this;

    toggleOnInterection({ anchor: toggler, target: dropdown, instance: this });
    addDismiss(this, dropdown);

    on(dropdown, EVENT_KEYDOWN, this._onKeydown.bind(this));
    on(toggler, EVENT_KEYDOWN, async (event) => {
      const { keyCode, shiftKey } = event;
      const horizontal = opts.togglerHorizontal;
      const prevCode = horizontal ? KEY_ARROW_LEFT : KEY_ARROW_UP;
      const nextCode = horizontal ? KEY_ARROW_RIGHT : KEY_ARROW_DOWN;
      const arrowActivated = prevCode === keyCode || nextCode === keyCode;
      if (
        arrowActivated ||
        (keyCode === KEY_TAB && !shiftKey && this.isShown)
      ) {
        event.preventDefault();
      }
      if (arrowActivated) {
        if (!this.isShown) {
          await show({ event, trigger: toggler });
        }
      }
      if (arrowActivated || (keyCode === KEY_TAB && !shiftKey)) {
        this.focusableElems[0]?.focus();
      }
    });

    return callInitShow(this, dropdown);
  }
  _update() {
    const { base, opts, transition, on, off, hide, dropdown } = this;

    this.transition = Transition.createOrUpdate(
      transition,
      base,
      opts.transition,
      { [HIDE_MODE]: ACTION_REMOVE, keepPlace: false },
    );

    opts.mode = base.getAttribute(DATA_UI_PREFIX + MODE) ?? opts.mode;

    this.updateToggler();

    if (opts.itemClickHide) {
      on(dropdown, EVENT_CLICK, (event) => {
        const trigger = closest(event.target, this.focusableElems);
        trigger && hide({ event, trigger });
      });
    } else {
      off(dropdown, EVENT_CLICK);
    }
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
  get focusableElems() {
    return getOptionElems(this, this.opts.items, this.dropdown).filter(
      (elem) => !isUnfocusable(elem),
    );
  }
  _onKeydown(event) {
    const { keyCode, shiftKey } = event;
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
    const { toggler, focusableElems, hide, opts } = this;

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

    if (currentIndex === 0 && shiftKey && keyCode === KEY_TAB) {
      event.preventDefault();
      toggler.focus();
      return;
    }

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
    const { isInit, toggler, opts } = this;
    if (!isInit) return;
    this.emit(EVENT_BEFORE_DESTROY);
    removeClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX]);
    removeAttr(toggler, [
      opts.a11y[OPTION_ARIA_EXPANDED] && ARIA_EXPANDED,
      opts.a11y[OPTION_ARIA_CONTROLS] && ARIA_CONTROLS,
    ]);
    return baseDestroy(this, destroyOpts);
  }

  async toggle(s, params) {
    const {
      toggler,
      dropdown,
      opts,
      emit,
      teleport,
      transition,
      isShown,
      isAnimating,
    } = this;
    const { awaitAnimation, autofocus, a11y } = opts;
    const {
      animated,
      trigger,
      silent,
      event,
      ignoreConditions,
      ignoreAutofocus,
    } = normalizeToggleParameters(params);

    s ??= !isShown;

    if (!ignoreConditions && ((awaitAnimation && isAnimating) || s === isShown))
      return;

    this.isShown = s;

    if (isAnimating && !awaitAnimation) {
      await transition.cancel();
    }

    if (s) {
      opts.absolute ? toggler.after(dropdown) : body.appendChild(dropdown);
    }

    s && teleport?.move(this);

    const eventParams = { event, trigger };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    a11y[OPTION_ARIA_EXPANDED] && toggler.setAttribute(ARIA_EXPANDED, !!s);

    toggleClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);

    const promise = floatingTransition(this, {
      s,
      animated,
      silent,
      eventParams,
    });

    !s && dropdown.contains(doc.activeElement) && toggler.focus();

    s && !ignoreAutofocus && autofocus && callAutofocus(this);

    awaitPromise(promise, () =>
      emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams),
    );

    animated && awaitAnimation && (await promise);

    return this;
  }
}

export default Dropdown;
