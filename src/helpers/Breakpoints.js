import { EVENT_CHANGE } from "./constants";
import { mergeDeep } from "./utils";

class Breakpoints {
  constructor(breakpoints, opts) {
    this._onResize = this._onResize.bind(this);

    breakpoints = Object.entries(breakpoints).sort((a, b) => +a[0] - +b[0]);

    this.mql = breakpoints.map(([width, data], i) => {
      let media;
      if (i === 0) {
        media = `(max-width:${breakpoints[1][0] - 1}px)`;
      } else if (i === breakpoints.length - 1) {
        media = `(min-width:${width}px)`;
      } else {
        media = `(min-width:${width}px) and (max-width:${
          breakpoints[i + 1][0] - 1
        }px)`;
      }

      const mq = window.matchMedia(media);

      mq.addEventListener(EVENT_CHANGE, this._onResize);
      return { mq, width: +width, data };
    });
    this.breakpoints = breakpoints;
    this.opts = opts;
    this._onResize();
  }
  _onResize(e) {
    if (!e || e.matches) {
      this.checkBreakpoints();
    }
  }
  checkBreakpoints() {
    const { opts, breakpoint, mql } = this;

    let currentData = {},
      newBreakpoint;
    for (const { width, data, mq } of mql) {
      if (width && !mq.matches) break;
      newBreakpoint = [data, width];
      currentData = mergeDeep(currentData, data);
    }

    if (!breakpoint || breakpoint[1] !== newBreakpoint[1]) {
      this.breakpoint = newBreakpoint;
      opts.onUpdate && opts.onUpdate(newBreakpoint, currentData);
    }

    return this.breakpoint;
  }
  destroy() {
    this.mql.forEach(({ mq }) =>
      mq.removeEventListener(EVENT_CHANGE, this._onResize),
    );
  }
}

export default Breakpoints;
