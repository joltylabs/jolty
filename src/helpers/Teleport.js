import {
  UI_PREFIX,
  OPTION_TO,
  OPTION_POSITION,
  OPTION_KEEP_PLACE,
  doc,
} from "./constants";
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
  [OPTION_KEEP_PLACE, TELEPORT + upperFirst(OPTION_KEEP_PLACE)],
];

class Teleport {
  static Default = {
    [OPTION_TO]: false,
    [OPTION_POSITION]: "beforeend",
    [OPTION_KEEP_PLACE]: true,
    enableAttributes: true,
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

    if (opts.enableAttributes) {
      this.opts = updateOptsByData(opts, this.elem, TELEPORT_DATA_ATTRIBUTES);
    } else {
      this.opts = opts;
    }

    return this;
  }
  move(...toParameters) {
    const { opts, elem } = this;
    const { position, keepPlace } = opts;
    let to = callOrReturn(opts.to, ...toParameters);
    to = isString(to) ? doc.querySelector(to) : to;

    if (!to) return;
    this.placeholder ||= keepPlace
      ? doc.createComment(UI_PREFIX + TELEPORT + ":" + elem.id)
      : null;
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
        (opts.enableAttributes && elem.dataset[TELEPORT_DATA_ATTRIBUTE])
      ? new Teleport(elem, opts, defaultOpts)
      : null;
  }
}
export default Teleport;
