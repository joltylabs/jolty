import {
  EVENT_BEFORE_INIT,
  EVENT_BEFORE_DESTROY,
  EVENT_BEFORE_SHOW,
  EVENT_SHOWN,
  EVENT_BEFORE_HIDE,
  EVENT_HIDDEN,
  CLASS,
  HOVER,
  FOCUS,
  ACTION_REMOVE,
  TOP,
  ANCHOR,
  TARGET,
  UI_PREFIX,
  ARIA_DESCRIBEDBY,
  DATA_UI_PREFIX,
  DEFAULT_FLOATING_OPTIONS,
  DEFAULT_OPTIONS,
  OPTION_ARIA_DESCRIBEDBY,
  TITLE,
  CONTENT,
  TOOLTIP,
  body,
  CLASS_ACTIVE_SUFFIX,
  HIDE_MODE,
  MODE,
  ABSOLUTE,
} from "./helpers/constants";

import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import {
  getElement,
  setAttribute,
  toggleClass,
  inDOM,
  removeAttribute,
} from "./helpers/dom";
import Transition from "./helpers/Transition.js";

import {
  normalizeToggleParameters,
  getEventsPrefix,
  getClassActive,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  toggleOnInterection,
  floatingTransition,
  callInitShow,
  awaitPromise,
} from "./helpers/modules";

const UI_TOOLTIP = UI_PREFIX + TOOLTIP;

class Tooltip extends ToggleMixin(Base, TOOLTIP) {
  static Default = {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_FLOATING_OPTIONS,
    eventPrefix: getEventsPrefix(TOOLTIP),
    placement: TOP,
    template: (content) =>
      `<div class="${UI_TOOLTIP}"><div class="${UI_TOOLTIP}-arrow" data-${UI_TOOLTIP}-arrow></div><div class="${UI_TOOLTIP}-content">${content}</div></div>`,
    interactive: false,
    removeTitle: true,
    tooltipClass: "",
    [ANCHOR + CLASS_ACTIVE_SUFFIX]: getClassActive(TOOLTIP),
    trigger: HOVER + " " + FOCUS,
    content: null,
  };

  static get BASE_NODE_NAME() {
    return ANCHOR;
  }
  constructor(elem, opts) {
    super(elem, opts);
  }
  _update() {
    const { tooltip, opts, transition } = this;

    this.transition = Transition.createOrUpdate(
      transition,
      tooltip,
      opts.transition,
      { [HIDE_MODE]: ACTION_REMOVE, keepPlace: false },
    );

    opts[MODE] =
      this[ANCHOR].getAttribute(DATA_UI_PREFIX + TOOLTIP + "-" + MODE) ??
      opts[MODE];

    opts.a11y && setAttribute(tooltip, TOOLTIP);
  }
  destroy(destroyOpts) {
    const { isInit, anchor, tooltip, id, _cache, emit, opts } = this;
    if (!isInit) return;
    emit(EVENT_BEFORE_DESTROY);
    if (opts.a11y) {
      removeAttribute(tooltip, TOOLTIP);
      setAttribute(anchor, ARIA_DESCRIBEDBY, (val) =>
        val === id + "-" + TARGET ? _cache[OPTION_ARIA_DESCRIBEDBY] : val,
      );
    }

    if (_cache[TITLE]) {
      anchor[TITLE] = _cache[TITLE];
    }
    return baseDestroy(this, destroyOpts);
  }
  init() {
    const { opts, anchor, id, isInit, emit } = this;

    if (isInit) return;

    emit(EVENT_BEFORE_INIT);

    this._cache = { [TITLE]: anchor[TITLE] };

    const target = (this.tooltip = getElement(
      opts.template(
        opts[CONTENT] ??
          anchor.getAttribute(DATA_UI_PREFIX + TOOLTIP + "-" + CONTENT) ??
          anchor[TITLE],
        this,
      ),
    ));
    target.id ||= id + "-" + TARGET;

    anchor.removeAttribute(TITLE);
    toggleClass(
      target,
      anchor.getAttribute(DATA_UI_PREFIX + TOOLTIP + "-" + CLASS) ??
        opts.tooltipClass,
      true,
    );

    this._update();

    toggleOnInterection({ anchor, target, instance: this });

    addDismiss(this, target);

    return callInitShow(this, target);
  }

  async toggle(s, params) {
    const {
      transition,
      anchor,
      tooltip,
      id,
      opts,
      emit,
      _cache,
      isShown,
      isAnimating,
    } = this;
    const awaitAnimation = opts.awaitAnimation;
    const { animated, trigger, silent, event, ignoreConditions } =
      normalizeToggleParameters(params);

    s ??= !isShown;

    if (
      (!ignoreConditions &&
        ((awaitAnimation && isAnimating) || s === isShown)) ||
      (!s && !inDOM(tooltip))
    )
      return;

    this.isShown = s;

    if (isAnimating && !awaitAnimation) {
      await transition.cancel();
    }

    const eventParams = { event, trigger };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    if (opts.a11y) {
      setAttribute(
        anchor,
        ARIA_DESCRIBEDBY,
        s
          ? (value) => {
              value && (_cache[OPTION_ARIA_DESCRIBEDBY] = value);
              return id + "-" + TARGET;
            }
          : _cache[OPTION_ARIA_DESCRIBEDBY] ?? null,
      );
    }

    toggleClass(anchor, opts[ANCHOR + CLASS_ACTIVE_SUFFIX], s);

    if (s) {
      opts.mode === ABSOLUTE
        ? anchor.after(tooltip)
        : body.appendChild(tooltip);
    }

    const promise = floatingTransition(this, {
      s,
      animated,
      silent,
      eventParams,
    });

    awaitPromise(promise, () =>
      emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams),
    );

    animated && awaitAnimation && (await promise);

    return this;
  }
}

export default Tooltip;
