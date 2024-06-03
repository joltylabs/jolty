import {
  EVENT_BEFORE_INIT,
  EVENT_BEFORE_DESTROY,
  EVENT_BEFORE_SHOW,
  EVENT_BEFORE_HIDE,
  CLASS,
  HOVER,
  FOCUS,
  TOP,
  ANCHOR,
  TARGET,
  ARIA_DESCRIBEDBY,
  DATA_UI_PREFIX,
  DEFAULT_FLOATING_OPTIONS,
  DEFAULT_OPTIONS,
  OPTION_ARIA_DESCRIBEDBY,
  TITLE,
  CONTENT,
  TOOLTIP,
  CLASS_ACTIVE_SUFFIX,
  CLASS_ACTIVE,
  TRANSITION,
  TRIGGER,
  INERT,
  BEFORE,
  END,
  AFTER,
  DISMISS,
  OPTION_TOP_LAYER,
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
  updateOptsByData,
  kebabToCamel,
  addStatusClasses,
} from "./helpers/utils";
import {
  baseDestroy,
  floatingTransition,
  callShowInit,
  toggleOnInterection,
  addDismiss,
  checkFloatings,
} from "./helpers/modules";
import Teleport from "./helpers/Teleport.js";
import {
  addPopoverAttribute,
  destroyTopLayer,
} from "./helpers/modules/toggleTopLayer.js";

class Tooltip extends ToggleMixin(Base, TOOLTIP) {
  static Default = {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_FLOATING_OPTIONS,
    delay: [150, 0],
    eventPrefix: getEventsPrefix(TOOLTIP),
    placement: TOP,
    template: (content) =>
      `<div class="${TOOLTIP}"><div class="${TOOLTIP}-${CONTENT}">${content}</div></div>`,
    interactive: false,
    removeTitle: true,
    tooltipClass: "",
    [ANCHOR + CLASS_ACTIVE_SUFFIX]: getClassActive(TOOLTIP),
    [TOOLTIP + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    trigger: HOVER + " " + FOCUS,
    content: null,
  };

  static get BASE_NODE_NAME() {
    return ANCHOR;
  }
  constructor(elem, opts) {
    super(elem, opts);
  }
  init() {
    const { opts, anchor, id, isInit, _emit } = this;

    if (isInit) return;

    anchor.id = id;

    _emit(EVENT_BEFORE_INIT);

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

    this.teleport = new Teleport(target, { disableAttributes: true });

    this._update();

    opts[DISMISS] && addDismiss(this, target);

    return callShowInit(this, target);
  }
  _update() {
    const { tooltip, base, opts, teleport } = this;

    updateOptsByData(opts, base, [
      TRANSITION,
      [TRIGGER, kebabToCamel(TOOLTIP + "-" + TRIGGER)],
    ]);

    tooltip.toggleAttribute(INERT, !opts.interactive);

    this.transition = Transition.createOrUpdate(
      this.transition,
      tooltip,
      opts.transition,
    );

    teleport.opts.to = opts.moveToRoot ? document.body : base;
    teleport.opts.position = opts.moveToRoot ? BEFORE + END : AFTER + END;

    addPopoverAttribute(this, tooltip);
    toggleOnInterection(this, base, tooltip);

    addStatusClasses(this, OPTION_TOP_LAYER);

    opts.a11y && setAttribute(tooltip, TOOLTIP);
  }
  destroy(destroyOpts) {
    if (this.isInit) return;
    const { anchor, tooltip, id, _cache, _emit, opts } = this;
    _emit(EVENT_BEFORE_DESTROY);
    if (opts.a11y) {
      removeAttribute(tooltip, TOOLTIP);
      setAttribute(anchor, ARIA_DESCRIBEDBY, (val) =>
        val === id + "-" + TARGET ? _cache[OPTION_ARIA_DESCRIBEDBY] : val,
      );
    }

    if (_cache[TITLE]) {
      anchor[TITLE] = _cache[TITLE];
    }
    destroyTopLayer(tooltip);
    return baseDestroy(this, destroyOpts);
  }

  async toggle(s, params) {
    const { anchor, tooltip, id, opts, _emit, _cache, isOpen, isAnimating } =
      this;
    const awaitAnimation = opts.awaitAnimation;
    let { animated, trigger, silent, event } =
      normalizeToggleParameters(params);

    s ??= !isOpen;

    if (
      (awaitAnimation && isAnimating) ||
      s === isOpen ||
      (!s && !inDOM(tooltip))
    )
      return;

    this.isOpen = s;

    if (opts.interactive && checkFloatings(this, s)) return;

    if (isAnimating && !awaitAnimation) {
      await this.transition.cancel();
    }

    const openTooltip = [...Tooltip.instances.values()].find(
      (tooltip) => tooltip.isOpen && tooltip !== this,
    );
    console.log(openTooltip);
    if (openTooltip) {
      animated = false;
      openTooltip.hide(false);
    }

    const eventParams = { event, trigger };

    !silent && _emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    const promise = floatingTransition(this, {
      s,
      animated,
      silent,
      eventParams,
    });

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
    toggleClass(tooltip, opts[TOOLTIP + CLASS_ACTIVE_SUFFIX], s);

    animated && awaitAnimation && (await promise);

    return this;
  }
}

export default Tooltip;
