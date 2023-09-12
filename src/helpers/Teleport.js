import {
  UI_PREFIX,
  POSITION,
  TELEPORT,
  doc,
  DATA_UI_PREFIX,
} from "./constants";
import { isString, isObject } from "./is";
import { mergeDeep, callOrReturn, getDatasetValue } from "./utils";

class Teleport {
  static Default = {
    to: false,
    [POSITION]: "beforeend",
    disableAttributes: false,
  };
  constructor(elem, opts = {}, defaultOpts) {
    this.elem = elem;
    this.update(opts, defaultOpts);
  }
  update(opts, defaultOpts = {}) {
    opts = isObject(opts) ? opts : { to: opts };
    opts = mergeDeep(
      this.constructor.Default,
      defaultOpts,
      opts,
      getDatasetValue(this.elem, TELEPORT, "to"),
    );

    this.opts = opts;

    if (!opts.to) {
      return this.destroy();
    }

    return this;
  }
  move(...toParameters) {
    const { opts, elem } = this;
    const { position } = opts;
    let to = callOrReturn(opts.to, ...toParameters);
    to = isString(to) ? doc.querySelector(to) : to;

    if (!to) return;
    this.placeholder = doc.createComment(UI_PREFIX + TELEPORT + ":" + elem.id);

    if (this.placeholder) {
      elem.before(this.placeholder);
    }
    to.insertAdjacentElement(position, elem);
    return this;
  }
  destroy() {
    this.reset();
  }
  reset() {
    this.placeholder?.replaceWith(this.elem);
    this.placeholder = null;
    return this;
  }
  static createOrUpdate(teleport, elem, opts, defaultOpts) {
    return teleport
      ? teleport.update(opts, defaultOpts)
      : opts !== false ||
        (!opts.disableAttributes &&
          elem.getAttribute(DATA_UI_PREFIX + TELEPORT))
      ? new Teleport(elem, opts, defaultOpts)
      : null;
  }
}
export default Teleport;
