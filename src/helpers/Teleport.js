import { UI_PREFIX, OPTION_TO, OPTION_POSITION, doc } from "./constants";
import { isString, isObject } from "./is";
import {
  mergeDeep,
  callOrReturn,
  updateOptsByData,
  upperFirst,
  kebabToCamel,
} from "./utils";
const TELEPORT = "teleport";
const TELEPORT_DATA_ATTRIBUTE = kebabToCamel(UI_PREFIX + TELEPORT);
const TELEPORT_DATA_ATTRIBUTES = [
  [OPTION_TO, TELEPORT],
  [OPTION_POSITION, TELEPORT + upperFirst(OPTION_POSITION)],
];

class Teleport {
  static Default = {
    [OPTION_TO]: false,
    [OPTION_POSITION]: "beforeend",
    disableAttributes: false,
  };
  constructor(elem, opts = {}, defaultOpts) {
    this.elem = elem;
    this.update(opts, defaultOpts);
  }
  update(opts, defaultOpts = {}) {
    const dataset = this.elem.dataset;
    const defaultConfig = this.constructor.Default;
    if (opts === false && !dataset[TELEPORT_DATA_ATTRIBUTE]) {
      return this.destroy();
    }
    opts = isObject(opts) ? opts : { to: opts };
    opts = mergeDeep(defaultConfig, defaultOpts, opts);

    if (!opts.disableAttributes) {
      this.opts = updateOptsByData(opts, this.elem, TELEPORT_DATA_ATTRIBUTES);
    } else {
      this.opts = opts;
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
        (!opts.disableAttributes && elem.dataset[TELEPORT_DATA_ATTRIBUTE])
      ? new Teleport(elem, opts, defaultOpts)
      : null;
  }
}
export default Teleport;
