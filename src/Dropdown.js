import {
  EVENT_BEFORE_DESTROY,
  EVENT_BEFORE_SHOW,
  EVENT_BEFORE_HIDE,
  EVENT_CLICK,
  EVENT_KEYDOWN,
  CLASS_ACTIVE,
  ARIA_CONTROLS,
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
  TELEPORT,
  TRANSITION,
  TRIGGER,
  ITEM,
  LEFT,
  RIGHT,
  DOWN,
  UP,
} from "./helpers/constants";

import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import {
  toggleClass,
  removeClass,
  removeAttribute,
  setAttribute,
  closest,
  is,
} from "./helpers/dom";
import Transition from "./helpers/Transition.js";
import {
  normalizeToggleParameters,
  isUnfocusable,
  getDataSelector,
  getDefaultToggleSelector,
  getOptionElems,
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
} from "./helpers/modules";
import Teleport from "./helpers/Teleport.js";
import { isFunction } from "./helpers/is/index.js";

const DIRECTIONS = {
  [KEY_ARROW_LEFT]: LEFT,
  [KEY_ARROW_UP]: UP,
  [KEY_ARROW_RIGHT]: RIGHT,
  [KEY_ARROW_DOWN]: DOWN,
  x: [LEFT, RIGHT],
  y: [UP, DOWN],
};

class Dropdown extends ToggleMixin(Base, DROPDOWN) {
  static Default = {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_FLOATING_OPTIONS,
    eventPrefix: getEventsPrefix(DROPDOWN),
    itemClickHide: true,
    arrowActivation: "y",
    autofocus: true,
    items: getDataSelector(DROPDOWN + "-" + ITEM),
    trigger: CLICK,
    [TOGGLER]: null,
    [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [DROPDOWN + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
  };

  constructor(elem, opts) {
    super(elem, opts);
  }
  init() {
    if (this.isInit) return;

    this.base.id = this.id;

    this._update();

    const { toggler, base, show, on } = this;

    on(base, EVENT_KEYDOWN, this._onKeydown.bind(this));
    on(toggler, EVENT_KEYDOWN, async (event) => {
      let arrowActivation = this.opts.arrowActivation;
      const { keyCode } = event;

      if (DIRECTIONS[arrowActivation]) {
        arrowActivation = DIRECTIONS[arrowActivation];
      }

      const arrowActivated = arrowActivation.includes(DIRECTIONS[keyCode]);

      if (arrowActivated) {
        event.preventDefault();
        if (!this.isOpen) {
          await show({ event, trigger: toggler });
        }
        if (this.isAnimating && !this.isOpen) return;
        this.focusableElems
          .at(keyCode === KEY_ARROW_UP || keyCode === KEY_ARROW_LEFT ? -1 : 0)
          ?.focus();
      }
    });

    this[TELEPORT] = new Teleport(base, { disableAttributes: true });

    return callShowInit(this);
  }
  _update() {
    const { base, opts, on, off, hide } = this;
    updateOptsByData(opts, base, [TRIGGER, HIDE_MODE]);

    this[TRANSITION] = Transition.createOrUpdate(
      this[TRANSITION],
      base,
      opts[TRANSITION],
    );

    this.updateToggler();

    if (opts.itemClickHide) {
      on(base, EVENT_CLICK, async (event) => {
        const trigger = closest(event.target, this.focusableElems);
        if (
          !trigger ||
          (opts.itemClickHide !== true &&
            (isFunction(opts.itemClickHide)
              ? await !opts.itemClickHide({
                  trigger,
                  dropdown: this,
                  event,
                })
              : !is(trigger, opts.itemClickHide)))
        )
          return;
        hide({ event, trigger });
      });
    } else {
      off(base, EVENT_CLICK);
    }

    toggleOnInterection(this);

    addDismiss(this, base);
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
    const isControl = [
      KEY_ENTER,
      KEY_SPACE,
      KEY_END,
      KEY_HOME,
      KEY_ARROW_LEFT,
      KEY_ARROW_UP,
      KEY_ARROW_RIGHT,
      KEY_ARROW_DOWN,
    ].includes(event.keyCode);
    const { focusableElems, opts } = this;

    if (!isControl && event.keyCode !== KEY_TAB) {
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
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : lastIndex;

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
        // hide({ event, trigger: event.target });
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
    const { opts, toggler, base } = this;
    this.emit(EVENT_BEFORE_DESTROY);
    opts.a11y && removeAttribute(toggler, ARIA_CONTROLS, ARIA_EXPANDED);
    removeClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX]);
    removeClass(base, opts[DROPDOWN + CLASS_ACTIVE_SUFFIX]);
    return baseDestroy(this, destroyOpts);
  }

  async toggle(s, params) {
    const { isOpen, isAnimating, toggler, base, opts, emit } = this;
    const { awaitAnimation, a11y } = opts;
    const { animated, silent, trigger, event, ignoreConditions } =
      normalizeToggleParameters(params);

    s ??= !isOpen;

    if (!ignoreConditions && ((awaitAnimation && isAnimating) || s === isOpen))
      return;

    this.isOpen = s;

    if (checkFloatings(this, s)) return;

    if (isAnimating && !awaitAnimation) {
      await this[TRANSITION].cancel();
    }

    const eventParams = { event, trigger };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    a11y && toggler.setAttribute(ARIA_EXPANDED, !!s);

    const promise = floatingTransition(this, {
      s,
      animated,
      silent,
      eventParams,
    });

    toggleClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);
    toggleClass(base, opts[DROPDOWN + CLASS_ACTIVE_SUFFIX], s);

    animated && awaitAnimation && (await promise);

    return this;
  }
}

export default Dropdown;
