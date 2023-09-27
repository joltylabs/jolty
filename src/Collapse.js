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
  HIDE_MODE,
  ACTION_REMOVE,
  HIDDEN,
  TRANSITION,
  TELEPORT,
  OPTION_HASH_NAVIGATION,
  OPTION_AUTODESTROY,
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
  toggleHideModeState,
} from "./helpers/modules";

const COLLAPSE = "collapse";

class Collapse extends ToggleMixin(Base, COLLAPSE) {
  static Default = {
    ...DEFAULT_OPTIONS,
    eventPrefix: getEventsPrefix(COLLAPSE),
    [OPTION_HASH_NAVIGATION]: false,
    dismiss: true,
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

    this.emit(EVENT_BEFORE_INIT);

    this._update();

    return callShowInit(this);
  }
  _update() {
    const { base, opts } = this;
    updateOptsByData(
      opts,
      base,
      [HIDE_MODE, OPTION_HASH_NAVIGATION, OPTION_AUTODESTROY],
      [OPTION_HASH_NAVIGATION, OPTION_AUTODESTROY],
    );

    this[TELEPORT] = Teleport.createOrUpdate(
      this[TELEPORT],
      base,
      opts[TELEPORT],
    )?.move(this);

    if (opts[HIDE_MODE] === ACTION_REMOVE && base[HIDDEN]) {
      toggleHideModeState(false, this);
    }

    this[TRANSITION] = Transition.createOrUpdate(
      this[TRANSITION],
      base,
      opts[TRANSITION],
      { cssVariables: true },
    );

    this.updateTriggers();

    addDismiss(this);
    addHashNavigation(this);
  }
  destroy(destroyOpts) {
    // eslint-disable-next-line prefer-const
    let { opts, togglers, base } = this;

    if (!this.isInit) return;

    this.emit(EVENT_BEFORE_DESTROY);

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
              setAttribute(toggler, ROLE, BUTTON);
            }
          }
          toggleClass(
            toggler,
            opts[TOGGLER + CLASS_ACTIVE_SUFFIX],
            !!this.isOpen,
          );
          this.on(toggler, EVENT_CLICK, (event) => {
            event.preventDefault();
            this.toggle(null, { trigger: toggler, event });
          });
        }
        return toggler;
      },
    ));
  }
  async toggle(s, params) {
    const { base, togglers, opts, emit, isOpen, isAnimating } = this;
    const { awaitAnimation, a11y } = opts;
    const { animated, silent, trigger, event, ignoreConditions } =
      normalizeToggleParameters(params);

    s ??= !isOpen;

    if (!ignoreConditions && ((awaitAnimation && isAnimating) || s === isOpen))
      return;

    this.isOpen = s;

    if (isAnimating && !awaitAnimation) {
      await this[TRANSITION].cancel();
    }

    const eventParams = { trigger, event };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    s && toggleHideModeState(true, this);

    !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

    const promise = this[TRANSITION]?.run(s, animated);

    a11y && setAttribute(togglers, ARIA_EXPANDED, !!s);
    toggleClass(togglers, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);
    toggleClass(base, opts[COLLAPSE + CLASS_ACTIVE_SUFFIX], s);

    awaitPromise(promise, () => {
      !s && toggleHideModeState(false, this);
      !silent && emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
      if (!s && opts[OPTION_AUTODESTROY]) {
        opts[OPTION_AUTODESTROY] && this.destroy({ remove: true });
      }
    });

    animated && awaitAnimation && (await promise);

    return this;
  }
}

export default Collapse;
