import {
  ROLE,
  BUTTON,
  A11Y,
  ARIA_CONTROLS,
  ARIA_EXPANDED,
  DEFAULT_OPTIONS,
  EVENT_BEFORE_INIT,
  EVENT_BEFORE_DESTROY,
  EVENT_DESTROY,
  EVENT_BEFORE_SHOW,
  EVENT_SHOW,
  EVENT_SHOWN,
  EVENT_BEFORE_HIDE,
  EVENT_HIDE,
  EVENT_HIDDEN,
  EVENT_CLICK,
  DEFAULT_AUTOFOCUS,
  OPTION_ARIA_CONTROLS,
  OPTION_ARIA_EXPANDED,
  CLASS_ACTIVE,
  CLASS_ACTIVE_SUFFIX,
  TOGGLER,
  AUTOFOCUS,
} from "./helpers/constants";
import Base from "./helpers/Base.js";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";
import { removeAttr, setAttribute, toggleClass } from "./helpers/dom";
import {
  normalizeToggleParameters,
  replaceWord,
  arrayUnique,
  arrayFrom,
  getEventsPrefix,
  getDefaultToggleSelector,
  updateModule,
  getOptionElems,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  callAutofocus,
  callInitShow,
  awaitPromise,
} from "./helpers/modules";

const COLLAPSE = "collapse";

class Collapse extends ToggleMixin(Base, COLLAPSE) {
  static DefaultA11y = {
    [OPTION_ARIA_CONTROLS]: true,
    [OPTION_ARIA_EXPANDED]: true,
    role: true,
  };
  static DefaultAutofocus = {
    elem: DEFAULT_AUTOFOCUS,
    required: false,
  };
  static Default = {
    ...DEFAULT_OPTIONS,
    eventPrefix: getEventsPrefix(COLLAPSE),
    autofocus: true,
    hashNavigation: true,
    dismiss: true,
    [TOGGLER]: true,
    [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [COLLAPSE + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
  };

  constructor(elem, opts) {
    super(elem, opts);
  }
  _update() {
    const { base, opts, transition, teleport } = this;

    addDismiss(this);
    updateModule(this, AUTOFOCUS);
    updateModule(this, A11Y);

    this.teleport = Teleport.createOrUpdate(
      teleport,
      base,
      opts.teleport,
    )?.move(this);

    this.transition = Transition.createOrUpdate(
      transition,
      base,
      opts.transition,
    );

    this.updateTriggers();

    return this;
  }
  destroy(destroyOpts) {
    let {
      // eslint-disable-next-line prefer-const
      opts: { a11y },
      togglers,
    } = this;

    if (!this.isInit) return;

    this.emit(EVENT_BEFORE_DESTROY);

    if (a11y[OPTION_ARIA_CONTROLS]) {
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

    removeAttr(togglers, [
      a11y[OPTION_ARIA_CONTROLS] && ARIA_CONTROLS,
      a11y[OPTION_ARIA_EXPANDED] && ARIA_EXPANDED,
      a11y.role && ROLE,
    ]);

    baseDestroy(this, destroyOpts);
    return this;
  }

  init() {
    if (this.isInit) return;

    this.emit(EVENT_BEFORE_INIT);

    this._update();

    return callInitShow(this);
  }
  updateTriggers() {
    const { opts, id } = this;

    return (this.togglers = getOptionElems(
      this,
      opts[TOGGLER] === true
        ? ({ id }) => getDefaultToggleSelector(id, true)
        : opts[TOGGLER],
    ).map((toggler) => {
      if (!this.togglers?.includes(toggler)) {
        if (opts.a11y[OPTION_ARIA_CONTROLS]) {
          setAttribute(toggler, ARIA_CONTROLS, (v) =>
            v ? arrayUnique(v.split(" ").concat(id)).join(" ") : id,
          );
        }
        if (opts.a11y.role && toggler.tagName !== BUTTON.toLowerCase()) {
          setAttribute(toggler, ROLE, BUTTON);
        }
        toggleClass(
          toggler,
          opts[TOGGLER + CLASS_ACTIVE_SUFFIX],
          !!this.isShown,
        );
        this.on(toggler, EVENT_CLICK, (event) => {
          event.preventDefault();
          this.toggle(null, { trigger: toggler, event });
        });
      }
      return toggler;
    }));
  }
  async toggle(s, params) {
    const { base, transition, togglers, opts, emit, isShown, isAnimating } =
      this;
    const { awaitAnimation, a11y } = opts;
    const {
      animated,
      silent,
      trigger,
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

    const eventParams = { trigger, event };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    a11y[OPTION_ARIA_EXPANDED] && setAttribute(togglers, ARIA_EXPANDED, !!s);
    toggleClass(togglers, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);
    toggleClass(base, opts[COLLAPSE + CLASS_ACTIVE_SUFFIX], s);

    const promise = transition.run(s, animated, {
      [s ? EVENT_SHOW : EVENT_HIDE]: () =>
        !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams),
      [EVENT_DESTROY]: () =>
        this.destroy({ remove: true, destroyTransition: false }),
    });

    s && !ignoreAutofocus && callAutofocus(this);

    awaitPromise(promise, () =>
      emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams),
    );

    animated && awaitAnimation && (await promise);

    return this;
  }
}

export default Collapse;
