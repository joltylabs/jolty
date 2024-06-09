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
  STATE_MODE,
  TRANSITION,
  TRIGGER,
  ITEM,
  LEFT,
  RIGHT,
  DOWN,
  UP,
  OPTION_PREVENT_SCROLL,
  TOP_LAYER_OPTIONS_NAMES,
  AUTO,
  DISMISS,
  MODAL,
  OPTION_TOP_LAYER,
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
  addStatusClasses,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  toggleOnInterection,
  floatingTransition,
  callShowInit,
  checkFloatings,
  togglePreventScroll,
} from "./helpers/modules";
import Teleport from "./helpers/Teleport.js";
import { isFunction } from "./helpers/is/index.js";
import {
  addPopoverAttribute,
  destroyTopLayer,
} from "./helpers/modules/toggleTopLayer.js";

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
    autofocus: false,
    items: getDataSelector(DROPDOWN + "-" + ITEM),
    trigger: CLICK,
    [TOGGLER]: null,
    [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [DROPDOWN + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [OPTION_PREVENT_SCROLL]: AUTO,
  };

  constructor(elem, opts) {
    super(elem, opts);
  }
  init() {
    if (this.isInit) return;

    const { base, show, _on, opts } = this;

    base.id = this.id;

    this.teleport = new Teleport(base, { disableAttributes: true });

    this._update();

    _on(base, EVENT_KEYDOWN, this._onKeydown.bind(this));
    _on(this.toggler, EVENT_KEYDOWN, async (event) => {
      let arrowActivation = opts.arrowActivation;
      const { keyCode } = event;

      if (DIRECTIONS[arrowActivation]) {
        arrowActivation = DIRECTIONS[arrowActivation];
      }

      const arrowActivated = arrowActivation.includes(DIRECTIONS[keyCode]);

      if (arrowActivated) {
        event.preventDefault();
        if (!this.isOpen) {
          await show({ event, trigger: this.toggler });
        }
        if (this.isAnimating && !this.isOpen) return;
        this.focusableElems
          .at(keyCode === KEY_ARROW_UP || keyCode === KEY_ARROW_LEFT ? -1 : 0)
          ?.focus();
      }
    });

    opts[DISMISS] && addDismiss(this);

    return callShowInit(this);
  }
  _update() {
    const { base, opts, _on, _off, hide } = this;
    updateOptsByData(
      opts,
      base,
      [TRANSITION, STATE_MODE, TRIGGER, ...TOP_LAYER_OPTIONS_NAMES],
      TOP_LAYER_OPTIONS_NAMES,
    );

    this.transition = Transition.createOrUpdate(
      this.transition,
      base,
      opts.transition,
    );

    this.teleport.opts.to = opts.moveToRoot ? document.body : null;

    this.updateToggler();

    if (opts.itemClickHide) {
      _on(base, EVENT_CLICK, async (event) => {
        const trigger = closest(event.target, this.focusableElems);
        if (
          !trigger ||
          (opts.itemClickHide !== true &&
            (isFunction(opts.itemClickHide)
              ? await !opts.itemClickHide(this, {
                  trigger,
                  event,
                })
              : !is(trigger, opts.itemClickHide)))
        )
          return;
        hide({ event, trigger });
      });
    } else {
      _off(base, EVENT_CLICK);
    }

    addPopoverAttribute(this);
    toggleOnInterection(this);

    addStatusClasses(this, MODAL, OPTION_TOP_LAYER, OPTION_PREVENT_SCROLL);
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
      (elem) => elem === document.activeElement,
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
    this._emit(EVENT_BEFORE_DESTROY);
    opts.a11y && removeAttribute(toggler, ARIA_CONTROLS, ARIA_EXPANDED);
    removeClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX]);
    removeClass(base, opts[DROPDOWN + CLASS_ACTIVE_SUFFIX]);
    togglePreventScroll(this, false);
    destroyTopLayer(base);
    return baseDestroy(this, destroyOpts);
  }

  async toggle(s, params) {
    const { isOpen, isAnimating, toggler, base, opts, _emit } = this;
    const { awaitAnimation, a11y } = opts;
    const { animated, silent, trigger, event } =
      normalizeToggleParameters(params);

    s ??= !isOpen;

    if ((awaitAnimation && isAnimating) || s === isOpen) return;

    this.isOpen = s;

    if (checkFloatings(this, s)) return;

    if (isAnimating && !awaitAnimation) {
      await this.transition.cancel();
    }

    const eventParams = { event, trigger };

    !silent && _emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    a11y && (toggler[ARIA_EXPANDED] = !!s);

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
