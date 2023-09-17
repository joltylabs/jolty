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
import { camelToKebab, updateOptsByData } from "./utils";

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

  constructor(elem, opts, defaultOpts) {
    this.elem = elem;
    this.update(opts, defaultOpts);
    this.promises = [];

    this.isInit = true;
  }
  update(opts, defaultOpts = {}) {
    opts = isString(opts) ? { name: opts } : opts;

    opts = {
      ...Transition.Default,
      ...defaultOpts,
      ...opts,
    };

    this.opts = updateOptsByData(opts, this.elem, [
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
    const { offsetWidth, offsetHeight, style } = this.elem;
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
    this.elem.style.transition = NONE;
    this.setClasses([s ? ENTER_FROM : LEAVE_FROM]);
    this.elem.offsetWidth;
    this.elem.style.transition = "";
    this.setClasses([s ? ENTER_ACTIVE : LEAVE_ACTIVE, s ? ENTER_TO : LEAVE_TO]);
    return this;
  }

  setClasses(animations) {
    const { elem, opts } = this;
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
        elem.classList[s ? ACTION_ADD : ACTION_REMOVE](
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
            elem.style.setProperty(name, value);
          } else {
            elem.style.removeProperty(name);
          }
        });
      });
    }
  }
  collectPromises(s) {
    const { elem, promises, opts } = this;
    const state = s ? ENTER : LEAVE;
    const duration = opts.duration?.[state] ?? opts.duration;

    promises.length = 0;
    let promisesEvent, promisesAnimation;
    if (isFunction(opts[state])) {
      promisesEvent = new Promise((resolve) => opts[state](elem, resolve));
    }
    let animations;
    if (opts.css) {
      animations = elem.getAnimations();
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
    const { elem, opts } = this;
    if (!elem) return;

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
  static createOrUpdate(transition, elem, opts, defaultOpts) {
    if (!opts) {
      transition?.destroy();
      return;
    }
    return transition
      ? transition.update(opts, defaultOpts)
      : new Transition(elem, opts, defaultOpts);
  }
}
