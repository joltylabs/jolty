import { PX, EVENT_CHANGE } from "./constants";
import { mergeDeep } from "./utils";

class Breakpoints {
  static mql = {};
  static instances = new Set();
  constructor(breakpoints, opts) {
    const unit = opts.unit ?? PX;
    this._onResize = this._onResize.bind(this);
    breakpoints = Object.entries(breakpoints).sort((a, b) => a[0] - b[0]);
    this.mql = breakpoints.map(([width, data], i) => {
      width = +width;
      const media = !i
        ? `not all and (min-width:${breakpoints[i + 1][0]}${unit})`
        : `(min-width:${width}${unit})`;
      const mq = (this.constructor.mql[width] ||= window.matchMedia(media));
      mq.addEventListener(EVENT_CHANGE, this._onResize);
      return { mq, width, data };
    });
    this.breakpoints = breakpoints;
    this.opts = opts;
    this._onResize();
    this.constructor.instances.add(this);
  }
  _onResize(e) {
    if (!e || e.matches) {
      this.checkBreakpoints();
    }
  }
  checkBreakpoints(ignoreConditions) {
    const { opts, breakpoint, mql } = this;
    let currentData, newBreakpoint;
    for (const { width, data, mq } of mql) {
      if (width && !mq.matches) break;
      newBreakpoint = [data, width];
      currentData = mergeDeep(currentData ?? data, data);
    }
    if (ignoreConditions || !breakpoint || breakpoint[1] !== newBreakpoint[1]) {
      this.breakpoint = newBreakpoint;
      opts.onUpdate && opts.onUpdate(newBreakpoint, currentData);
    }

    return this.breakpoint;
  }
  destroy() {
    this.mql.forEach(({ mq }) =>
      mq.removeEventListener(EVENT_CHANGE, this._onResize),
    );
    this.constructor.instances.delete(this);
  }
}

export default Breakpoints;
