import {
  UI_PREFIX,
  PROGRESS,
  EVENT_MOUSEENTER,
  EVENT_FOCUSIN,
  EVENT_FOCUSOUT,
  EVENT_PAUSE,
  EVENT_RESUME,
  EVENT_RESET,
  ACTION_PAUSE,
  ACTION_RESUME,
  ACTION_RESET,
  ACTION_TOGGLE,
  EVENT_VISIBILITY_CHANGE,
  doc,
  AUTOHIDE,
  EVENT_MOUSEOVER,
  EVENT_MOUSEOUT,
  EVENT_MOUSELEAVE,
  SELECTOR_FOCUS_WITHIN,
  SELECTOR_HOVER,
} from "./constants";
import { callOrReturn, getOption, mergeDeep, getDataSelector } from "./utils";
import { EventHandler } from "./EventHandler";
import { isNumber } from "./is";

class Autoaction {
  static Default = {
    progress: getDataSelector(AUTOHIDE, PROGRESS),
    safeArea: getDataSelector(AUTOHIDE, "safe-area"),
    duration: 5000,
    durationUpdate: null,
    pauseOnMouseEnter: true,
    resetOnMouseEnter: true,
    pauseOnFocusEnter: true,
    resetOnFocusEnter: true,
    visibilityControl: false,
    cssVariable: UI_PREFIX + AUTOHIDE + "-" + PROGRESS,
  };
  constructor(elem, action, opts, defaultOpts) {
    const Default = this.constructor.Default;
    opts = isNumber(opts)
      ? { ...Default, duration: opts }
      : mergeDeep(Default, defaultOpts, opts);
    const { on, off, emit } = new EventHandler();
    Object.assign(this, { elem, action, on, off, emit, opts });
    [
      "checkTime",
      ACTION_PAUSE,
      ACTION_RESUME,
      ACTION_RESET,
      ACTION_TOGGLE,
    ].forEach((action) => (this[action] = this[action].bind(this)));

    this.progressElem = getOption(false, this, opts.progress, elem);
    this.safeAreaElem = getOption(false, this, opts.safeArea, elem);

    if (opts.visibilityControl) {
      on(doc, EVENT_VISIBILITY_CHANGE, () => this.toggle(!doc.hidden));
    }
  }
  toggleInterections(s) {
    const { opts, elem, on, off, resume, pause, reset, safeAreaElem } = this;
    const {
      pauseOnMouseEnter,
      resetOnMouseEnter,
      pauseOnFocusEnter,
      resetOnFocusEnter,
    } = opts;

    if (
      !pauseOnMouseEnter &&
      !resetOnMouseEnter &&
      !pauseOnFocusEnter &&
      !resetOnFocusEnter
    ) {
      reset();
      return;
    }

    const actionsElem = safeAreaElem || elem;

    if (s) {
      reset();
      let interactedMouse, interactedFocus;
      if (pauseOnFocusEnter || resetOnFocusEnter) {
        interactedFocus = actionsElem.matches(SELECTOR_FOCUS_WITHIN);

        if (interactedFocus) pause();

        on(actionsElem, [EVENT_FOCUSIN, EVENT_FOCUSOUT], ({ type }) => {
          interactedFocus = safeAreaElem
            ? actionsElem.matches(SELECTOR_FOCUS_WITHIN)
            : type === EVENT_FOCUSIN;

          if (interactedFocus) {
            resetOnFocusEnter && reset();
            pauseOnFocusEnter && pause();
          } else if (!interactedMouse) {
            pauseOnFocusEnter && resume();
          }
        });
      }
      if (pauseOnMouseEnter || resetOnMouseEnter) {
        if (actionsElem.matches(SELECTOR_HOVER)) pause();

        const events = safeAreaElem
          ? [EVENT_MOUSEOVER, EVENT_MOUSEOUT]
          : [EVENT_MOUSEENTER, EVENT_MOUSELEAVE];

        on(actionsElem, events, ({ type }) => {
          interactedMouse = safeAreaElem
            ? actionsElem.matches(SELECTOR_HOVER)
            : type === EVENT_MOUSEENTER;

          if (interactedMouse) {
            resetOnMouseEnter && reset();
            pauseOnMouseEnter && pause();
          } else if (!interactedFocus) {
            pauseOnMouseEnter && resume();
          }
        });
      }
    } else {
      off();
    }
    return this;
  }
  checkTime() {
    const { opts, elem, progressElem, paused, _prevProgress } = this;
    if (paused) return;
    const current = performance.now();
    this.timeCurrent = Math.round(current - this.timeBegin);
    const time = opts.duration - this.timeCurrent;
    const progress = +Math.max(time / opts.duration, 0).toFixed(4);
    this._prevProgress = progress;
    if (progress && progress === _prevProgress) {
      return requestAnimationFrame(this.checkTime);
    }

    if (opts.cssVariable) {
      progressElem?.style.setProperty("--" + opts.cssVariable, progress);
    }

    callOrReturn(opts.durationUpdate, { elem, time, progress });

    if (progress <= 0) {
      this.action();
    } else {
      requestAnimationFrame(this.checkTime);
    }
  }
  toggle(s = this.paused) {
    return s ? this.resume() : this.pause();
  }
  pause() {
    this.paused = true;
    this.emit(EVENT_PAUSE);
    return this;
  }
  resume() {
    this.paused = false;
    this.timeBegin = performance.now() - this.timeCurrent;
    this.checkTime();
    this.emit(EVENT_RESUME);
    return this;
  }
  reset() {
    this.paused = false;
    this.timeBegin = performance.now();
    this.checkTime();
    this.emit(EVENT_RESET);
    return this;
  }
  destroy() {
    this.paused = true;
    this.off();
  }
  static createOrUpdate(autoaction, elem, action, opts, defaultOpts) {
    if (autoaction) {
      return autoaction.destroy();
    } else if (opts) {
      return new Autoaction(elem, action, opts, defaultOpts);
    }
  }
}

export default Autoaction;
