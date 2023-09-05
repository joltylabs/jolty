import {
  UI,
  VAR_UI_PREFIX,
  WIDTH,
  HEIGHT,
  PX,
  ACTION_ADD,
  ACTION_REMOVE,
  NONE,
  ENTER,
  ENTER_ACTIVE,
  ENTER_FROM,
  ENTER_TO,
  LEAVE,
  LEAVE_ACTIVE,
  LEAVE_FROM,
  LEAVE_TO,
  DURATION,
  TRANSITION,
  NAME,
} from "./constants";

import { isString, isFunction, isObject } from "./is";
import { toMs, camelToKebab, updateOptsByData, upperFirst } from "./utils";

const DATASET_DURATION = UI + upperFirst(DURATION);
const DATASET_DURATION_ENTER = DATASET_DURATION + upperFirst(ENTER);
const DATASET_DURATION_LEAVE = DATASET_DURATION + upperFirst(LEAVE);

export default class Transition {
  static Default = {
    name: UI,
    css: true,
    cssVariables: false,
    [ENTER]: null,
    [ENTER_ACTIVE]: null,
    [ENTER_FROM]: null,
    [ENTER_TO]: null,
    [LEAVE]: null,
    [LEAVE_FROM]: null,
    [LEAVE_ACTIVE]: null,
    [LEAVE_TO]: null,
    [DURATION]: null,
  };

  constructor(base, opts, defaultOpts) {
    this.base = base;
    this.update(opts, defaultOpts);
    this.promises = [];

    this.isInit = true;
  }
  update(opts, defaultOpts = {}) {
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

    opts = {
      ...defaultConfig,
      ...defaultOpts,
      ...opts,
      ...datasetData,
    };

    this.opts = updateOptsByData(opts, base, [
      ENTER_ACTIVE,
      ENTER_FROM,
      ENTER_TO,
      LEAVE_ACTIVE,
      LEAVE_FROM,
      LEAVE_TO,
      [NAME, TRANSITION + "Name"],
    ]);

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

  async run(s, animated = true) {
    const { base, opts } = this;
    if (!base) return;

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
      }
    }

    this.setClasses(null);
    this.promises.length = 0;
  }
  destroy() {
    this.setClasses(null);
    this.isInit = false;
  }
  static createOrUpdate(transition, base, opts, defaultOpts) {
    if (!opts) {
      transition?.destroy();
      return;
    }
    return transition
      ? transition.update(opts, defaultOpts)
      : new Transition(base, opts, defaultOpts);
  }
}
