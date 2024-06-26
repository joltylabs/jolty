import {
  ROLE,
  BUTTON,
  ARIA_CONTROLS,
  ARIA_EXPANDED,
  DEFAULT_OPTIONS,
  EVENT_BEFORE_INIT,
  EVENT_BEFORE_DESTROY,
  EVENT_BEFORE_SHOW,
  EVENT_SHOW,
  EVENT_SHOWN,
  EVENT_BEFORE_HIDE,
  EVENT_HIDE,
  EVENT_HIDDEN,
  EVENT_CLICK,
  CLASS_ACTIVE,
  CLASS_ACTIVE_SUFFIX,
  TOGGLER,
  STATE_MODE,
  ACTION_REMOVE,
  HIDDEN,
  TRANSITION,
  OPTION_HASH_NAVIGATION,
  OPTION_AUTODESTROY,
  UNTIL_FOUND,
  MODE_HIDDEN_UNTIL_FOUND,
  DISMISS,
} from "./helpers/constants";
import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";
import {
  removeAttribute,
  removeClass,
  setAttribute,
  toggleClass,
} from "./helpers/dom";
import {
  normalizeToggleParameters,
  replaceWord,
  arrayUnique,
  arrayFrom,
  getEventsPrefix,
  getOptionElems,
  getDefaultToggleSelector,
  updateOptsByData,
  awaitPromise,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  callShowInit,
  addHashNavigation,
  toggleStateMode,
} from "./helpers/modules";

const COLLAPSE = "collapse";

class Collapse extends ToggleMixin(Base, COLLAPSE) {
  static Default = {
    ...DEFAULT_OPTIONS,
    eventPrefix: getEventsPrefix(COLLAPSE),
    [OPTION_HASH_NAVIGATION]: false,
    [OPTION_AUTODESTROY]: false,
    [TOGGLER]: ({ id }) => getDefaultToggleSelector(id, true),
    [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [COLLAPSE + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
  };

  constructor(elem, opts) {
    super(elem, opts);
  }
  init() {
    if (this.isInit) return;

    this.base.id = this.id;

    this._emit(EVENT_BEFORE_INIT);

    this._update();

    this.opts[OPTION_HASH_NAVIGATION] && addHashNavigation(this);
    this.opts[DISMISS] && addDismiss(this);

    return callShowInit(this);
  }
  _update() {
    const { base, opts } = this;

    if (opts[STATE_MODE] === HIDDEN && base[HIDDEN] === UNTIL_FOUND) {
      opts[STATE_MODE] = MODE_HIDDEN_UNTIL_FOUND;
    }

    updateOptsByData(
      opts,
      base,
      [TRANSITION, STATE_MODE, OPTION_HASH_NAVIGATION, OPTION_AUTODESTROY],
      [OPTION_HASH_NAVIGATION, OPTION_AUTODESTROY],
    );

    this.teleport = Teleport.createOrUpdate(
      this.teleport,
      base,
      opts.teleport,
    )?.move(this);

    if (opts[STATE_MODE] === ACTION_REMOVE && base[HIDDEN]) {
      toggleStateMode(false, this);
    }

    this.transition = Transition.createOrUpdate(
      this.transition,
      base,
      opts.transition,
      { cssVariables: true },
    );

    this.updateTriggers();
  }
  destroy(destroyOpts) {
    // eslint-disable-next-line prefer-const
    let { opts, togglers, base } = this;

    if (!this.isInit) return;

    this._emit(EVENT_BEFORE_DESTROY);

    if (opts.a11y) {
      const otherTogglers = arrayFrom(this.instances.values())
        .filter((item) => item !== this)
        .flatMap((item) => item.togglers.filter((t) => togglers.includes(t)));
      if (otherTogglers.length) {
        togglers = togglers.filter((toggler) => {
          if (!otherTogglers.includes(toggler)) {
            return true;
          } else {
            setAttribute(toggler, ARIA_CONTROLS, (v) =>
              replaceWord(v, this.id),
            );
          }
        });
      }
    }

    opts.a11y && removeAttribute(togglers, ARIA_CONTROLS, ARIA_EXPANDED, ROLE);
    removeClass(base, opts[COLLAPSE + CLASS_ACTIVE_SUFFIX]);

    baseDestroy(this, destroyOpts);

    return this;
  }

  updateTriggers() {
    const { opts, id } = this;

    return (this.togglers = getOptionElems(this, opts[TOGGLER]).map(
      (toggler) => {
        if (!this.togglers?.includes(toggler)) {
          if (opts.a11y) {
            setAttribute(toggler, ARIA_CONTROLS, (v) =>
              v ? arrayUnique(v.split(" ").concat(id)).join(" ") : id,
            );
            if (toggler.tagName !== BUTTON.toLowerCase()) {
              toggler[ROLE] = BUTTON;
            }
          }
          toggleClass(
            toggler,
            opts[TOGGLER + CLASS_ACTIVE_SUFFIX],
            !!this.isOpen,
          );
          this._on(toggler, EVENT_CLICK, (event) => {
            event.preventDefault();
            this.toggle(null, { trigger: toggler, event });
          });
        }
        return toggler;
      },
    ));
  }
  async toggle(s, params) {
    const { base, togglers, opts, _emit, isOpen, isAnimating } = this;
    const { awaitAnimation, a11y } = opts;
    const { animated, silent, trigger, event } =
      normalizeToggleParameters(params);

    s ??= !isOpen;

    if ((awaitAnimation && isAnimating) || s === isOpen) return;

    this.isOpen = s;

    if (isAnimating && !awaitAnimation) {
      await this.transition.cancel();
    }

    const eventParams = { trigger, event };

    !silent && _emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    s && toggleStateMode(true, this);

    !silent && _emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

    const promise = this.transition?.run(s, animated);

    a11y && setAttribute(togglers, ARIA_EXPANDED, !!s);
    toggleClass(togglers, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);
    toggleClass(base, opts[COLLAPSE + CLASS_ACTIVE_SUFFIX], s);

    awaitPromise(promise, () => {
      !s && toggleStateMode(false, this);
      !silent && _emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
      if (!s && opts[OPTION_AUTODESTROY]) {
        opts[OPTION_AUTODESTROY] && this.destroy({ remove: true });
      }
    });

    animated && awaitAnimation && (await promise);

    return this;
  }
}

export default Collapse;
