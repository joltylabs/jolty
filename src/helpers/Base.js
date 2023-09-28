import {
  EVENT_BREAKPOINT,
  ACTION_TOGGLE,
  ACTION_SHOW,
  ACTION_HIDE,
  ACTION_INIT,
  ACTION_DESTROY,
  ACTION_UPDATE,
  ACTION_ON,
  ACTION_OFF,
  ACTION_EMIT,
  ACTION_ONCE,
  doc,
  POPOVER_API_SUPPORTED,
  UI_PREFIX,
  POPOVER,
} from "./constants";
import { isArray, isFunction, isHTML, isObject, isString } from "./is";
import { getElement, fragment } from "./dom";
import {
  mergeDeep,
  uuidGenerator,
  callOrReturn,
  getDataSelector,
  arrayFrom,
  getDatasetValue,
} from "./utils";
import { EventHandler } from "./EventHandler";
import Breakpoints from "./Breakpoints";

if (!POPOVER_API_SUPPORTED) {
  document.documentElement.classList.add(UI_PREFIX + "no-" + POPOVER);
}

function getDataValue(_data, dataName, elem) {
  const value = callOrReturn(_data[dataName], elem);
  if (!isObject(value)) return {};
  return _data[value.data]
    ? { ...getDataValue(_data, value.data, elem), ...value }
    : value;
}

class Base {
  static allInstances = new Map();
  static components = {};
  constructor(elem, opts) {
    if (isFunction(opts)) {
      opts = opts(elem);
    }
    opts ??= {};
    const { NAME, BASE_NODE_NAME, Default, _data, _templates, allInstances } =
      this.constructor;

    if (elem?.id && allInstances.get(elem.id)?.constructor?.NAME === NAME)
      return;

    Base.components[NAME] = this.constructor;

    const baseElemName = BASE_NODE_NAME ?? NAME;

    let dataName = opts.data;

    if (elem == null) {
      opts = mergeDeep(Default, getDataValue(_data, dataName, elem), opts);
      elem = isString(opts.template)
        ? callOrReturn(_templates[opts.template], opts)
        : opts.template?.(opts);
      this._fromTemplate = true;
    } else if (elem) {
      if (isHTML(elem)) {
        elem = fragment(elem);
        this._fromHTML = true;
      } else if (isString(elem)) {
        elem = doc.querySelector(elem);
      }

      const [datasetValue, isDataObject] = getDatasetValue(elem, NAME);

      dataName ||= !isDataObject && datasetValue;

      if (dataName && !_data[dataName]) return;

      opts = mergeDeep(
        Default,
        getDataValue(_data, dataName, elem),
        isDataObject && datasetValue,
        opts,
      );
    }
    elem = getElement(elem);

    if (!elem) return;

    this[baseElemName] = elem;

    this.baseOpts = this.opts = opts;

    this.uuid = uuidGenerator(UI_PREFIX + NAME + "-");

    this.id = elem.id || this.uuid;

    const eventHandler = new EventHandler();
    [ACTION_ON, ACTION_OFF, ACTION_ONCE].forEach((name) => {
      this[name] = (...params) => {
        eventHandler[name](...params);
        return this;
      };
    });

    [
      ACTION_TOGGLE,
      ACTION_SHOW,
      ACTION_HIDE,
      ACTION_INIT,
      ACTION_DESTROY,
      ACTION_UPDATE,
      ACTION_EMIT,
    ].forEach((action) => (this[action] = this[action]?.bind(this)));

    if (this.baseOpts.breakpoints) {
      this._initBreakpoints();
    } else {
      this.init();
    }

    allInstances.set(this.id, this);

    return this;
  }
  _initBreakpoints() {
    this.breakpoints = new Breakpoints(
      { 0: this.baseOpts, ...this.baseOpts.breakpoints },
      {
        onUpdate: (breakpoint, opts) => {
          this.emit(EVENT_BREAKPOINT, breakpoint, this.breakpoint);
          if (breakpoint[0].data) {
            const dataValue = getDataValue(
              this.constructor._data,
              breakpoint[0].data,
            );
            if (dataValue) {
              breakpoint[0] = { ...breakpoint[0], ...dataValue };
            }
          }
          this.opts = breakpoint[1]
            ? mergeDeep(opts, breakpoint[0])
            : { ...opts };
          delete this.opts.breakpoints;

          if (opts.destroy) {
            this.destroy({ keepInstance: true });
          } else if (this.isInit) {
            this._update?.();
          } else {
            this.init();
          }
          this.breakpoint = breakpoint;
        },
      },
    );
  }
  emit(eventName, ...detail) {
    const { opts, base } = this;
    const { on, eventDispatch, eventBubble, eventPrefix } = opts;
    detail = [this, ...detail];
    if (on) {
      on[eventName] && on[eventName](...detail);
      on.any && on.any(eventName, ...detail);
    }

    if (
      isArray(eventDispatch) ? eventDispatch.includes(eventName) : eventDispatch
    ) {
      const bubbles =
        (isArray(eventBubble) && eventBubble.includes(eventName)) ||
        !!eventBubble;
      base.dispatchEvent(
        new CustomEvent(eventPrefix + eventName, { detail, bubbles }),
      );
    }
    return this;
  }
  update(opts) {
    if (opts) {
      this.baseOpts = mergeDeep(this.baseOpts, opts);
      if (this.breakpoints || this.baseOpts.breakpoints) {
        this.breakpoints?.destroy();
        this.breakpoints = false;
        this._initBreakpoints();
      } else {
        this._update?.();
      }
    }
    return this;
  }
  get base() {
    return this[this.constructor.BASE_NODE_NAME ?? this.constructor.NAME];
  }
  get instances() {
    return this.constructor.instances;
  }
  get Default() {
    return this.constructor.Default;
  }
  static get(elem) {
    if (elem === undefined) return [...this.instances.values()];
    for (const [id, instance] of this.instances) {
      if ([id, instance.base].includes(elem)) {
        return instance;
      }
    }
  }
  static getOrCreate(elem, opts) {
    return this.get(elem, opts) || new this(elem, opts);
  }
  static initAll(root = doc) {
    return arrayFrom(root.querySelectorAll(getDataSelector(this.NAME))).map(
      (elem) => this.getOrCreate(elem),
    );
  }
  static updateDefault(opts) {
    return mergeDeep(this.Default, opts);
  }
  static data(name, opts) {
    if (!opts) {
      opts = name;
      name = "";
    }
    if (!opts) return this._data[name];
    this._data[name] = opts;
    return this;
  }
  static dispatchTopLayer(type) {
    const Toast = this.components.toast;
    if (Toast) {
      Toast.forceTopLayer(type);
    }
  }
}
export default Base;
