import {
  UI,
  UI_PREFIX,
  VAR_UI_PREFIX,
  HIDDEN,
  SHOWN,
  WIDTH,
  HEIGHT,
  CLASS,
  PX,
  ACTION_DESTROY,
  ACTION_ADD,
  ACTION_REMOVE,
  NONE,
  FLOATING_DATA_ATTRIBUTE,
  OPTION_KEEP_PLACE,
  BEFORE_ENTER,
  ENTER,
  ENTER_ACTIVE,
  ENTER_FROM,
  ENTER_TO,
  AFTER_ENTER,
  BEFORE_LEAVE,
  LEAVE,
  LEAVE_ACTIVE,
  LEAVE_FROM,
  LEAVE_TO,
  AFTER_LEAVE,
  HIDE_MODE,
  DURATION,
  TRANSITION,
  NAME,
  HIDDEN_CLASS,
} from "./constants";
import { toggleClass, removeClass } from "./dom";
import { isString, isFunction, isObject } from "./is";
import {
  toMs,
  camelToKebab,
  updateOptsByData,
  upperFirst,
  isShown,
  toggleHideModeState,
} from "./utils";

// const SHOWN_CLASS = UI_PREFIX + SHOWN;
const DATASET_DURATION = UI + upperFirst(DURATION);
const DATASET_DURATION_ENTER = DATASET_DURATION + upperFirst(ENTER);
const DATASET_DURATION_LEAVE = DATASET_DURATION + upperFirst(LEAVE);
const OPTION_SHOWN_CLASS = SHOWN + upperFirst(CLASS);
const OPTION_HIDDEN_CLASS = HIDDEN + upperFirst(CLASS);

export default class Transition {
  static Default = {
    name: UI,
    css: true,
    cssVariables: false,
    [HIDE_MODE]: HIDDEN,
    [OPTION_HIDDEN_CLASS]: "",
    [OPTION_SHOWN_CLASS]: "",
    [ENTER]: null,
    [BEFORE_ENTER]: null,
    [ENTER_ACTIVE]: null,
    [ENTER_FROM]: null,
    [ENTER_TO]: null,
    [AFTER_ENTER]: null,
    [BEFORE_LEAVE]: null,
    [LEAVE_ACTIVE]: null,
    [AFTER_LEAVE]: null,
    [DURATION]: null,
    [OPTION_KEEP_PLACE]: true,
  };
  constructor(base, opts = {}, defaultOpts) {
    this.base = base;
    this.updateConfig(opts, defaultOpts);
    this.promises = [];
    if (this.opts[HIDE_MODE] === ACTION_REMOVE && base[HIDDEN]) {
      toggleHideModeState(false, this, this.opts);
      base[HIDDEN] = false;
    } else {
      this.setFinishClass();
    }
    this.isInit = true;
  }
  updateConfig(opts, defaultOpts = {}) {
    const base = this.base;
    const defaultConfig = Transition.Default;
    const dataset = base.dataset;

    const datasetData = {};

    const duration = dataset[DATASET_DURATION];
    const durationEnter = dataset[DATASET_DURATION_ENTER];
    const durationLeave = dataset[DATASET_DURATION_LEAVE];
    if (duration || durationEnter || durationLeave) {
      datasetData.duration =
        durationEnter || durationLeave
          ? {
              enter: toMs(durationEnter ?? duration),
              leave: toMs(durationLeave ?? duration),
            }
          : toMs(duration);
    }

    opts = isString(opts) ? { name: opts } : opts;
    opts = { ...defaultConfig, ...defaultOpts, ...opts, ...datasetData };

    this.opts = updateOptsByData(opts, base, [
      HIDE_MODE,
      OPTION_HIDDEN_CLASS,
      OPTION_SHOWN_CLASS,
      ENTER_ACTIVE,
      ENTER_FROM,
      ENTER_TO,
      LEAVE_ACTIVE,
      LEAVE_FROM,
      LEAVE_TO,
      [NAME, TRANSITION + "Name"],
    ]);

    this.teleport = opts.teleport;

    if (opts[HIDE_MODE] !== CLASS) {
      removeClass(base, HIDDEN_CLASS);
    }

    return this;
  }
  toggleVariables(s) {
    const { offsetWidth, offsetHeight, style } = this.base;
    const rect = [offsetWidth, offsetHeight];
    [WIDTH, HEIGHT].forEach((name, i) => {
      const prop = VAR_UI_PREFIX + TRANSITION + "-" + name;
      if (s) {
        style.setProperty(prop, rect[i] + PX);
      } else {
        style.removeProperty(prop);
      }
    });
  }

  toggleAnimationClasses(s) {
    this.base.style.transition = NONE;
    this.setClasses([s ? ENTER_FROM : LEAVE_FROM]);
    this.base.offsetWidth;
    this.base.style.transition = "";
    this.setClasses([s ? ENTER_ACTIVE : LEAVE_ACTIVE, s ? ENTER_TO : LEAVE_TO]);
    return this;
  }
  setFinishClasses(s) {
    this.removeClasses(s);
    this.promises.length = 0;
  }
  removeClasses() {
    this.setClasses(null);
  }

  setClasses(animations) {
    const { base, opts } = this;
    const classes = ["", ""];
    const styles = [{}, {}];
    let hasStyle = false;
    let hasClass = false;
    [
      ENTER_ACTIVE,
      ENTER_FROM,
      ENTER_TO,
      LEAVE_ACTIVE,
      LEAVE_FROM,
      LEAVE_TO,
    ].forEach((state) => {
      const s = animations?.includes(state) | 0;
      if (isObject(opts[state])) {
        hasStyle = true;
        styles[s] = { ...styles[s], ...opts[state] };
      } else {
        hasClass = true;
        classes[s] +=
          (opts[state] ??
            (opts.name ? opts.name + "-" + camelToKebab(state) : "")) + " ";
      }
    });
    if (hasClass) {
      classes.forEach((classes, s) =>
        base.classList[s ? ACTION_ADD : ACTION_REMOVE](
          ...classes.split(" ").filter(Boolean),
        ),
      );
    }
    if (hasStyle) {
      styles.forEach((styles, s) => {
        Object.entries(styles).forEach(([name, value]) => {
          if (name[0] !== "-") {
            name = camelToKebab(name);
          }
          if (s) {
            base.style.setProperty(name, value);
          } else {
            base.style.removeProperty(name);
          }
        });
      });
    }
  }
  collectPromises(s) {
    const { base, promises, opts } = this;
    const state = s ? ENTER : LEAVE;
    const duration = opts.duration?.[state] ?? opts.duration;

    promises.length = 0;
    let promisesEvent, promisesAnimation;
    if (isFunction(opts[state])) {
      promisesEvent = new Promise((resolve) => opts[state](base, resolve));
    }
    let animations;
    if (opts.css) {
      animations = base.getAnimations();
      promisesAnimation =
        animations.length &&
        Promise.allSettled(animations.map(({ finished }) => finished));
    }

    if (!duration && !promisesEvent && !promisesAnimation) return promises;

    const promisesDuration =
      !isNaN(duration) && duration != null
        ? new Promise((resolve) => setTimeout(resolve, duration))
        : null;

    promisesDuration && promises.push(promisesDuration);
    promisesEvent && promises.push(promisesEvent);
    promisesAnimation && promises.push(promisesAnimation);

    this.animations = animations;

    return promises;
  }
  get isAnimating() {
    return !!this.promises.length;
  }
  cancel() {
    this.animations?.forEach((animation) => animation.cancel());
    return Promise.allSettled([this.getAwaitPromise()]);
  }
  getAwaitPromise() {
    return Promise.allSettled(this.promises);
  }

  setFinishClass(s) {
    const { base, opts } = this;

    s ??= isShown(base);

    if (opts[HIDE_MODE] === CLASS) {
      toggleClass(base, HIDDEN_CLASS, !s);
    }
    opts[OPTION_HIDDEN_CLASS] &&
      toggleClass(base, opts[OPTION_HIDDEN_CLASS], !s);
    opts[OPTION_SHOWN_CLASS] && toggleClass(base, opts[OPTION_SHOWN_CLASS], s);
  }
  async run(
    s,
    animated = true,
    { show, hide, shown, hidden, destroy, allowRemove = true } = {},
  ) {
    const { base, opts } = this;
    if (!base) return;

    opts[s ? BEFORE_ENTER : BEFORE_LEAVE]?.(base);

    const toggle = (s) => {
      allowRemove && toggleHideModeState(s, this, opts);
      this.setFinishClass(s);
      if (!s && opts[HIDE_MODE] === ACTION_DESTROY) {
        this.destroy();
        destroy?.(base);
      }
    };

    if (s) {
      toggle(s);
      show?.(base);
    } else {
      hide?.(base);
    }

    if (animated) {
      if (opts.css) {
        opts.cssVariables && this.toggleVariables(true);
        this.toggleAnimationClasses(s);
      }

      this.collectPromises(s);
      if (this.promises.length) {
        await this.getAwaitPromise();
      }
      if (opts.css) {
        opts.cssVariables && this.toggleVariables(false);
        this.setFinishClasses(s);
      }
    }

    if (s) {
      shown?.(base);
    } else {
      hidden?.(base);
      toggle(s);
    }

    opts[s ? AFTER_ENTER : AFTER_LEAVE]?.(base);
  }
  destroy() {
    this.removeClasses();
    this.placeholder?.replaceWith(this.base);
    this.isInit = false;
  }
  static createOrUpdate(transition, base, opts, defaultOpts) {
    return transition
      ? transition.update(opts, defaultOpts)
      : new Transition(base, opts, defaultOpts);
  }
}
