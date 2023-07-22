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
  doc,
} from "./constants";
import { toggleClass, removeClass, inDOM } from "./dom";
import { isString, isFunction, isObject } from "./is";
import { toMs, camelToKebab, updateOptsByData, upperFirst } from "./utils";

const HIDDEN_CLASS = UI_PREFIX + HIDDEN;
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
    variablePrefix: VAR_UI_PREFIX + TRANSITION + "-",
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
  constructor(elem, opts = {}, defaultOpts) {
    this.elem = elem;
    this.updateConfig(opts, defaultOpts);
    this.promises = [];
    if (this.opts[HIDE_MODE] === ACTION_REMOVE && elem[HIDDEN]) {
      this.toggleRemove(false);
      elem[HIDDEN] = false;
    } else {
      this.setFinishClass();
    }
    this.isInit = true;
  }
  updateConfig(opts, defaultOpts = {}) {
    const elem = this.elem;
    const defaultConfig = Transition.Default;
    const dataset = elem.dataset;

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

    this.opts = updateOptsByData(opts, elem.dataset, [
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
      removeClass(elem, HIDDEN_CLASS);
    }

    return this;
  }
  toggleVariables(s) {
    const { offsetWidth, offsetHeight, style } = this.elem;
    const rect = [offsetWidth, offsetHeight];
    [WIDTH, HEIGHT].forEach((name, i) => {
      const prop = this.opts.variablePrefix + name;
      if (s) {
        style.setProperty(prop, rect[i] + PX);
      } else {
        style.removeProperty(prop);
      }
    });
    return this;
  }

  toggleAnimationClasses(s) {
    this.elem.style.transition = NONE;
    this.setClasses([s ? ENTER_FROM : LEAVE_FROM]);
    this.elem.offsetWidth;
    this.elem.style.transition = "";
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

  get isShown() {
    const {
      elem,
      opts: { hideMode },
    } = this;
    return hideMode === ACTION_REMOVE
      ? inDOM(elem)
      : hideMode === CLASS
      ? !elem.classList.contains(HIDDEN_CLASS)
      : !elem.hasAttribute(hideMode);
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
    // this.cancelAnimations = this.animations?.map((animation) => {
    //    const { effect, currentTime, transitionProperty, animationName } = animation;
    //    return {
    //       animationName,
    //       transitionProperty,
    //       currentTime,
    //       ...effect.getTiming(),
    //    };
    // });
    this.animations?.forEach((animation) => animation.cancel());
    return this.getAwaitPromises();
  }
  getAwaitPromises() {
    return Promise.allSettled(this.promises);
  }
  toggleRemove(s = this.isEntering) {
    const { elem, opts } = this;
    const mode = opts[HIDE_MODE];
    if (mode === ACTION_REMOVE) {
      if (s) {
        if (opts[OPTION_KEEP_PLACE]) {
          this.placeholder?.replaceWith(elem);
          this.placeholder = null;
        } else {
          this.parent?.append(elem);
        }
      } else {
        if (opts[OPTION_KEEP_PLACE]) {
          elem.replaceWith(
            (this.placeholder ||= doc.createComment(
              UI_PREFIX + TRANSITION + ":" + elem.id,
            )),
          );
        } else {
          const parent = elem.parentElement;
          if (parent) {
            this.parent = parent.hasAttribute(FLOATING_DATA_ATTRIBUTE)
              ? parent.parentElement
              : parent;
            elem.remove();
          }
        }
      }
    } else if (mode !== ACTION_DESTROY && mode !== CLASS) {
      elem.toggleAttribute(mode, !s);
    }
  }
  setFinishClass(s = this.isShown) {
    const { elem, opts } = this;

    if (opts[HIDE_MODE] === CLASS) {
      toggleClass(elem, HIDDEN_CLASS, !s);
    }
    opts[OPTION_HIDDEN_CLASS] &&
      toggleClass(elem, opts[OPTION_HIDDEN_CLASS], !s);
    opts[OPTION_SHOWN_CLASS] && toggleClass(elem, opts[OPTION_SHOWN_CLASS], s);
  }
  async run(
    s,
    animated = true,
    { show, hide, shown, hidden, destroy, allowRemove = true } = {},
  ) {
    const { elem, opts } = this;
    if (!elem) return;

    this.isEntering = s;
    // this.cancelAnimations = null;

    opts[s ? BEFORE_ENTER : BEFORE_LEAVE]?.(elem);

    const toggle = (s) => {
      allowRemove && this.toggleRemove(s);
      this.setFinishClass(s);
      if (!s && opts[HIDE_MODE] === ACTION_DESTROY) {
        this.destroy();
        destroy?.(elem);
      }
    };

    if (s) {
      toggle(s);
      show?.(elem);
    } else {
      hide?.(elem);
    }

    if (animated) {
      opts.css && this.toggleVariables(true).toggleAnimationClasses(s);
      this.collectPromises(s);
      if (this.promises.length) {
        await this.getAwaitPromises();
      }
      opts.css && this.toggleVariables(false).setFinishClasses(s);
    }

    if (s) {
      shown?.(elem);
    } else {
      hidden?.(elem);
      toggle(s);
    }

    opts[s ? AFTER_ENTER : AFTER_LEAVE]?.(elem);
  }
  destroy() {
    this.removeClasses();
    this.placeholder?.replaceWith(this.elem);
    this.isInit = false;
  }
  static createOrUpdate(transition, elem, opts, defaultOpts) {
    return transition
      ? transition.update(opts, defaultOpts)
      : new Transition(elem, opts, defaultOpts);
  }
}
