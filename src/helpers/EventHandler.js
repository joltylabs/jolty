import { ACTION_ON, ACTION_OFF, ACTION_EMIT, ACTION_ONCE } from "./constants";
import { isString, isObject } from "./is";
import { closest, each } from "./dom";
import { strToArray, arrayFrom } from "./utils";

const getOptsObj = (args, newOpts) => {
  args = arrayFrom(args);
  const optsPosition = isString(args[2]) ? 4 : 3;
  let opts = args[optsPosition];
  opts = isObject(opts) ? opts : { capture: !!opts };
  args[optsPosition] = { ...opts, ...newOpts };
  return args;
};

class EventHandler {
  constructor() {
    this.eventsSet = new Set();
    for (const name of [ACTION_ON, ACTION_OFF, ACTION_EMIT, ACTION_ONCE]) {
      this[name] = this[name].bind(this);
    }
    this._id = 0;
  }
  getNamespaces(eventFullName) {
    let [event, ...namespace] = eventFullName.split(/\.(?![^([]*[\]])/);
    namespace = namespace?.join(".");
    event = event.replace(/[[\]']+/g, "");
    return { eventFullName, event, namespace };
  }
  on(elems, events, ...params) {
    let [_handler, _opts] = params;
    let deligate;

    if (isString(_handler)) {
      [deligate, _handler, _opts] = params;
    }
    if (!isObject(_opts)) {
      _opts = { capture: !!_opts };
    }

    _handler = ((fn) => (e) => {
      fn(e, e.detail);
    })(_handler);

    elems = each(elems, (elem) => {
      events = isString(events)
        ? strToArray(events)
        : isObject(events)
        ? [events]
        : events;
      events.forEach((eventFullName) => {
        const id = this._id++;
        const opts = { ..._opts };
        let handler = _handler;

        const { event, namespace } = isString(eventFullName)
          ? this.getNamespaces(eventFullName)
          : eventFullName;

        if (opts.once) {
          handler = ((fn) => (e) => {
            this.offId(id);
            fn(e);
          })(handler);
        }
        opts.once = false;

        if (deligate) {
          const isSelector = isString(deligate);
          handler = ((fn) => (e) => {
            e.deligateTarget = isSelector
              ? e.target.closest(deligate)
              : closest(e.target, deligate);
            if (e.deligateTarget) {
              fn(e);
            }
          })(handler);
        }

        elem.addEventListener(event, handler, opts);
        this.eventsSet.add({
          id,
          elem,
          eventFullName,
          event,
          namespace,
          handler,
          opts,
        });
      });
    });
    return elems;
  }
  once() {
    return this.on(...getOptsObj(arguments, { once: true }));
  }
  offId(id) {
    this.removeSets([arrayFrom(this.eventsSet).find((s) => s.id === id)]);
  }
  removeSets(sets, opts) {
    sets.forEach((set) => {
      if (!set) return;
      set.elem.removeEventListener(set.event, set.handler, opts);
      this.eventsSet.delete(set);
    });
  }
  off(elems, events, handler, opts) {
    const eventsSet = this.eventsSet;
    if (!arguments.length) {
      this.removeSets(eventsSet, opts);
    } else {
      if (elems === "*") {
        elems = arrayFrom(eventsSet).map((set) => set.elem);
      }
      return each(elems, (elem) => {
        if (events) {
          strToArray(events).forEach((eventFullName) => {
            const { event, namespace } = this.getNamespaces(eventFullName);
            const sets = arrayFrom(eventsSet).filter(
              (set) =>
                set.elem === elem &&
                (!namespace || set.namespace === namespace) &&
                (!event || set.event === event) &&
                (!handler || set.handler === handler),
            );

            this.removeSets(sets, opts);
          });
        } else {
          this.removeSets(
            [...eventsSet].filter((e) => e.elem === elem),
            opts,
          );
        }
      });
    }
  }
  emit(elems, events, opts) {
    each(elems, (elem) => {
      strToArray(events).forEach((event) => {
        elem.dispatchEvent(new CustomEvent(event, opts));
      });
    });
  }
}

export { EventHandler };
