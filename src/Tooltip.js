import {
  EVENT_BEFORE_INIT,
  EVENT_INIT,
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
  A11Y,
  ROLE,
  TITLE,
  CONTENT,
  TOOLTIP,
  body,
  CLASS_ACTIVE_SUFFIX,
} from "./helpers/constants";

import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import { getElement, setAttribute, toggleClass } from "./helpers/dom";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";
import { isObject } from "./helpers/is";
import {
  normalizeToggleParameters,
  updateModule,
  getEventsPrefix,
  getClassActive,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  toggleOnInterection,
  floatingTransition,
  callInitShow,
} from "./helpers/modules";

const UI_TOOLTIP = UI_PREFIX + TOOLTIP;

class Tooltip extends ToggleMixin(Base, TOOLTIP) {
  static DefaultA11y = {
    [ROLE]: TOOLTIP,
    [OPTION_ARIA_DESCRIBEDBY]: true,
  };
  static Default = {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_FLOATING_OPTIONS,
    eventPrefix: getEventsPrefix(TOOLTIP),
    placement: TOP,
    template: (content) =>
      `<div class="${UI_TOOLTIP}"><div class="${UI_TOOLTIP}-arrow" data-${UI_TOOLTIP}-arrow></div><div class="${UI_TOOLTIP}-content">${content}</div></div>`,
    interactive: false,
    removeTitle: true,
    [ANCHOR + CLASS_ACTIVE_SUFFIX]: getClassActive(TOOLTIP),
    trigger: HOVER + " " + FOCUS,
    content: null,
  };

  static get BASE_NODE_NAME() {
    return ANCHOR;
  }
  constructor(elem, opts = {}) {
    if (isObject(elem)) {
      opts = elem;
      elem = null;
    }
    super({ opts, elem });
  }
  _update() {
    const { tooltip, opts, transition, teleport, base } = this;
    this.teleport = Teleport.createOrUpdate(
      teleport,
      tooltip,
      opts.teleport ?? (opts.absolute ? base.parentNode : body),
    );
    this.transition = Transition.createOrUpdate(
      transition,
      tooltip,
      opts.transition,
      { hiddenMode: ACTION_REMOVE, keepPlace: false },
    );
    updateModule(this, A11Y);
    setAttribute(tooltip, opts.a11y[ROLE]);
  }
  destroy(destroyOpts) {
    const { isInit, anchor, id, _cache, emit } = this;
    if (!isInit) return;
    emit(EVENT_BEFORE_DESTROY);
    setAttribute(anchor, ARIA_DESCRIBEDBY, (val) =>
      val === id + "-" + TARGET ? _cache[OPTION_ARIA_DESCRIBEDBY] : val,
    );
    if (_cache[TITLE]) {
      anchor[TITLE] = _cache[TITLE];
    }
    return baseDestroy(this, destroyOpts);
  }
  init() {
    const { opts, anchor, id, isInit, instances, emit } = this;

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
      anchor.getAttribute(DATA_UI_PREFIX + TOOLTIP + "-" + CLASS),
      true,
    );

    this._update();

    instances.set(id, this);

    toggleOnInterection({ anchor, target, instance: this });

    addDismiss(this, target);

    this.isInit = true;

    emit(EVENT_INIT);

    callInitShow(this, target);

    return this;
  }

  async toggle(s, params) {
    const {
      transition,
      anchor,
      id,
      opts,
      emit,
      teleport,
      _cache,
      isEntering,
      isAnimating,
    } = this;
    const awaitAnimation = opts.awaitAnimation;
    const { animated, trigger, silent, event, ignoreConditions } =
      normalizeToggleParameters(params);

    s ??= !isEntering;

    if (
      !ignoreConditions &&
      ((awaitAnimation && isAnimating) || s === isEntering)
    )
      return;

    if (isAnimating && !awaitAnimation) {
      await transition.cancel();
    }

    const eventParams = { event, trigger };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    if (opts.a11y[OPTION_ARIA_DESCRIBEDBY]) {
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

    s && teleport?.move(this);

    const promise = floatingTransition(this, {
      s,
      animated,
      silent,
      eventParams,
    });

    animated && awaitAnimation && (await promise);

    !silent && emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);

    return this;
  }
}

export default Tooltip;
