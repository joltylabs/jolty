import {
  UI_PREFIX,
  PROGRESS,
  EVENT_MOUSELEAVE,
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
} from "./constants";
import { callOrReturn, getOption, mergeDeep, getDataSelector } from "./utils";
import { EventHandler } from "./EventHandler";
import { isNumber } from "./is";

class Autoaction {
  static Default = {
    progressElem: getDataSelector(PROGRESS),
    duration: 5000,
    decimal: 4,
    durationUpdate: null,
    pauseOnMouse: true,
    resetOnMouse: true,
    pauseOnFocus: true,
    resetOnFocus: true,
    visibilityControl: false,
    cssVariable: UI_PREFIX + PROGRESS,
  };
  constructor(elem, action, opts) {
    const Default = this.constructor.Default;
    opts = isNumber(opts)
      ? { ...Default, duration: opts }
      : mergeDeep(Default, opts);
    const { on, off, emit } = new EventHandler();
    Object.assign(this, { elem, action, on, off, emit, opts });
    [
      "checkTime",
      ACTION_PAUSE,
      ACTION_RESUME,
      ACTION_RESET,
      ACTION_TOGGLE,
    ].forEach((action) => (this[action] = this[action].bind(this)));

    this.progressElem = getOption(false, opts.progressElem, elem);

    if (opts.visibilityControl) {
      on(doc, EVENT_VISIBILITY_CHANGE, () => this.toggle(!doc.hidden));
    }
  }
  toggleInterections(s) {
    const { opts, elem, on, off, resume, pause, reset } = this;
    const { pauseOnMouse, resetOnMouse, pauseOnFocus, resetOnFocus } = opts;

    if (!pauseOnMouse && !resetOnMouse && !pauseOnFocus && !resetOnFocus)
      return;

    if (s) {
      reset();
      let interactedMouse, interactedFocus;
      if (pauseOnFocus || resetOnFocus) {
        on(elem, [EVENT_FOCUSIN, EVENT_FOCUSOUT], ({ type }) => {
          interactedFocus = type === EVENT_FOCUSIN;
          if (interactedFocus) {
            resetOnFocus && reset();
            pauseOnFocus && pause();
          } else if (!interactedMouse) {
            pauseOnFocus && resume();
          }
        });
      }
      if (pauseOnMouse || resetOnMouse) {
        on(elem, [EVENT_MOUSEENTER, EVENT_MOUSELEAVE], ({ type }) => {
          interactedMouse = type === EVENT_MOUSEENTER;
          if (interactedMouse) {
            resetOnMouse && reset();
            pauseOnMouse && pause();
          } else if (!interactedFocus) {
            pauseOnMouse && resume();
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
    const progress = +Math.max(time / opts.duration, 0).toFixed(opts.decimal);
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
  static createOrUpdate(autoaction, elem, action, opts) {
    if (autoaction) {
      return autoaction.destroy();
    } else if (opts !== false) {
      return new Autoaction(elem, action, opts);
    }
  }
}

export default Autoaction;
