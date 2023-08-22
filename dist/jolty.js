(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jolty = global.jolty || {}));
})(this, (function (exports) { 'use strict';

  const cache$2 = {};
  var kebabToCamel = (str = "") =>
    cache$2[str] ||
    (cache$2[str] = str.replace(/-./g, (match) => match[1].toUpperCase()));

  const cache$1 = {};
  var upperFirst = (str = "") =>
    cache$1[str] || (cache$1[str] = str[0].toUpperCase() + str.slice(1));

  const UI = "ui";
  const UI_PREFIX = UI + "-";
  const UI_EVENT_PREFIX = "." + UI;
  const VAR_UI_PREFIX = "--" + UI_PREFIX;
  const DATA_PREFIX = "data-";
  const DATA_UI_PREFIX = DATA_PREFIX + UI_PREFIX;
  const ACTIVE = "active";
  const CLASS_ACTIVE = UI_PREFIX + ACTIVE;

  const DEFAULT = "default";
  const NAME = "name";
  const MODE = "mode";

  const PX = "px";
  const NONE = "none";
  const ID = "id";

  const WIDTH = "width";
  const HEIGHT = "height";
  const TOP = "top";
  const LEFT = "left";
  const RIGHT = "right";
  const BOTTOM = "bottom";
  const CENTER = "center";
  const START = "start";
  const END = "end";
  const UP = "up";
  const DOWN = "down";
  const IN = "in";
  const OUT = "out";
  const TITLE = "title";

  const HORIZONTAL = "horizontal";
  const VERTICAL = "vertical";
  const ABSOLUTE = "absolute";
  const FIXED = "fixed";
  const TRANSITION = "transition";

  const DIV = "div";
  const BUTTON = "button";
  const WINDOW = "window";
  const DOCUMENT = "document";
  const CLASS = "class";
  const STYLE = "style";
  const KEY = "key";
  const ROLE = "role";
  const ROOT = "root";
  const CONFIRM = "confirm";
  const CANCEL = "cancel";

  const BEFORE = "before";
  const AFTER = "after";

  const MOUSE = "mouse";

  const CLICK = "click";
  const HOVER = "hover";
  const FOCUS = "focus";
  const SCROLL = "scroll";

  const HIDE = "hide";
  const HIDDEN = "hidden";
  const SHOW = "show";
  const SHOWN = "shown";
  const APPEAR = "appear";

  const TARGET = "target";
  const AVAILABLE = "awailable";
  const AVAILABLE_WIDTH = AVAILABLE + "-" + WIDTH;
  const AVAILABLE_HEIGHT = AVAILABLE + "-" + HEIGHT;
  const ANCHOR = "anchor";

  const MODAL = "modal";
  const CONTENT = "content";
  const BACKDROP = "backdrop";
  const POPOVER = "popover";
  const TOOLTIP = "tooltip";
  const TOGGLER = "toggler";
  const DROPDOWN = "dropdown";
  const ARROW = "arrow";
  const PROGRESS = "progress";
  const DISMISS = "dismiss";
  const FLOATING = "floating";
  const DIALOG = "dialog";

  const FLIP = "flip";
  const SHRINK = "shrink";
  const STICKY = "sticky";
  const PLACEMENT = "placement";
  const PADDING = "padding";
  const OFFSET = "offset";
  const BOUNDARY_OFFSET = "boundary-" + OFFSET;
  const WEBKIT_PREFIX = "-webkit-";
  const CLIP_PATH = "clip-path";
  const ARROW_OFFSET = ARROW + "-" + OFFSET;
  const ARROW_PADDING = ARROW + "-" + PADDING;
  const TRUE = "true";

  const doc = document;
  const body = doc.body;

  const ENTER = "enter";
  const LEAVE = "leave";
  const BEFORE_ENTER = BEFORE + upperFirst(ENTER);
  const ENTER_ACTIVE = ENTER + upperFirst(ACTIVE);
  const ENTER_FROM = ENTER + "From";
  const ENTER_TO = ENTER + "To";
  const AFTER_ENTER = AFTER + upperFirst(ENTER);
  const BEFORE_LEAVE = BEFORE + upperFirst(LEAVE);
  const LEAVE_ACTIVE = LEAVE + upperFirst(ACTIVE);
  const LEAVE_FROM = LEAVE + "From";
  const LEAVE_TO = LEAVE + "To";
  const AFTER_LEAVE = AFTER + upperFirst(LEAVE);
  const HIDE_MODE = HIDE + upperFirst(MODE);
  const DURATION = "duration";
  DURATION + upperFirst(ENTER);
  DURATION + upperFirst(LEAVE);

  const ACTION_INIT = "init";
  const ACTION_DESTROY = "destroy";
  const ACTION_TOGGLE = "toggle";
  const ACTION_SHOW = SHOW;
  const ACTION_HIDE = HIDE;
  const ACTION_ADD = "add";
  const ACTION_REMOVE = "remove";
  const ACTION_UPDATE = "update";
  const ACTION_PAUSE = "pause";
  const ACTION_RESUME = "resume";
  const ACTION_RESET = "reset";
  const ACTION_ON = "on";
  const ACTION_OFF = "off";
  const ACTION_EMIT = "emit";
  const ACTION_ONCE = "once";
  const ACTION_PREVENT = "prevent";

  const INERT = "inert";
  const AUTOFOCUS = "autofocus";
  const TABINDEX = "tabindex";
  const DISABLED = "disabled";
  const FLOATING_DATA_ATTRIBUTE = DATA_UI_PREFIX + FLOATING;
  const DATA_APPEAR = DATA_UI_PREFIX + APPEAR;

  const EVENT_INIT = ACTION_INIT;
  const EVENT_BEFORE_INIT = BEFORE + upperFirst(EVENT_INIT);
  const EVENT_DESTROY = ACTION_DESTROY;
  const EVENT_BEFORE_DESTROY = BEFORE + upperFirst(EVENT_DESTROY);
  const EVENT_BEFORE_SHOW = BEFORE + upperFirst(SHOW);
  const EVENT_SHOW = SHOW;
  const EVENT_SHOWN = SHOWN;
  const EVENT_BEFORE_HIDE = BEFORE + upperFirst(HIDE);
  const EVENT_HIDE = HIDE;
  const EVENT_HIDDEN = HIDDEN;
  const EVENT_PAUSE = ACTION_PAUSE;
  const EVENT_RESUME = ACTION_RESUME;
  const EVENT_RESET = ACTION_RESET;
  const EVENT_MOUSEENTER = MOUSE + ENTER;
  const EVENT_MOUSELEAVE = MOUSE + LEAVE;
  const EVENT_MOUSEDOWN = MOUSE + DOWN;
  const EVENT_CHANGE = "change";
  const EVENT_BREAKPOINT = "breakpoint";
  const EVENT_CLICK = CLICK;
  const EVENT_KEYDOWN = KEY + DOWN;
  const EVENT_KEYUP = KEY + UP;
  const EVENT_FOCUS = FOCUS;
  const EVENT_FOCUSIN = FOCUS + IN;
  const EVENT_FOCUSOUT = FOCUS + OUT;
  const EVENT_RIGHT_CLICK = "contextmenu";
  const EVENT_VISIBILITY_CHANGE = "visibilitychange";
  const EVENT_HIDE_PREVENTED = "hidePrevented";
  const EVENT_ACTION_OUTSIDE = `${EVENT_CLICK}.outside ${EVENT_KEYUP}.outside`;
  const EVENT_SCROLL = SCROLL;
  const EVENT_RESIZE = "resize";

  const ARIA = "aria";
  const ARIA_CONTROLS = ARIA + "-controls";
  const ARIA_EXPANDED = ARIA + "-expanded";
  const ARIA_SELECTED = ARIA + "-selected";
  const ARIA_HIDDEN = ARIA + "-" + HIDDEN;
  const ARIA_LABELLEDBY = ARIA + "-labelledby";
  const ARIA_DESCRIBEDBY = ARIA + "-describedby";
  const ARIA_ORIENTATION = ARIA + "-orientation";
  const ARIA_LIVE = ARIA + "-live";
  const ARIA_ATOMIC = ARIA + "-atomic";

  const KEY_ENTER = 13;
  const KEY_ESC = 27;
  const KEY_SPACE = 32;
  const KEY_END = 35;
  const KEY_HOME = 36;
  const KEY_TAB = 9;
  const KEY_ARROW_LEFT = 37;
  const KEY_ARROW_UP = 38;
  const KEY_ARROW_RIGHT = 39;
  const KEY_ARROW_DOWN = 40;

  const A11Y = "a11y";
  const OPTION_GROUP = "group";
  const OPTION_APPEAR = APPEAR;
  const OPTION_KEEP_PLACE = "keepPlace";
  const OPTION_PREVENT_SCROLL = "preventScroll";
  const OPTION_POSITION = "position";
  const OPTION_TO = "to";
  kebabToCamel(ARIA_LABELLEDBY);
  const OPTION_ARIA_DESCRIBEDBY = kebabToCamel(ARIA_DESCRIBEDBY);
  kebabToCamel(ARIA_EXPANDED);
  kebabToCamel(ARIA_SELECTED);
  kebabToCamel(ARIA_CONTROLS);
  const OPTION_ARIA_HIDDEN = kebabToCamel(ARIA_HIDDEN);
  kebabToCamel(ARIA_LIVE);
  kebabToCamel(ARIA_ATOMIC);
  const CLASS_ACTIVE_SUFFIX = "ClassActive";
  const ROLE_SUFFIX = upperFirst(ROLE);

  const OPTIONS_BOOLEAN = [OPTION_APPEAR, OPTION_KEEP_PLACE];
  const DEFAULT_OPTIONS = {
    [ACTION_INIT]: true,
    [ACTION_DESTROY]: false,
    data: "",
    on: null,
    [APPEAR]: null,
    eventDispatch: true,
    eventBubble: true,
    shown: null,
    a11y: true,
  };
  const DEFAULT_FLOATING_OPTIONS = {
    awaitAnimation: false,
    placement: BOTTOM,
    offset: 10,
    padding: 0,
    delay: [200, 0],
    boundaryOffset: 0,
    shrink: false,
    flip: false,
    sticky: false,
    escapeHide: true,
    outsideHide: true,
    mode: FIXED,
    arrow: {
      height: null,
      width: null,
      offset: 0,
      padding: 0,
    },
  };

  const SELECTOR_AUTOFOCUS = `[${AUTOFOCUS}]`;
  const SELECTOR_DISABLED = `[${DISABLED}]`;
  const SELECTOR_INERT = `[${INERT}]`;
  const SELECTOR_DATA_AUTOFOCUS = `[${DATA_UI_PREFIX + AUTOFOCUS}]`;
  const SELECTOR_DATA_CONFIRM = `[${DATA_UI_PREFIX + CONFIRM}]`;
  const SELECTOR_DATA_CANCEL = `[${DATA_UI_PREFIX + CANCEL}]`;
  const DEFAULT_AUTOFOCUS = `${SELECTOR_AUTOFOCUS},${SELECTOR_DATA_AUTOFOCUS}`;
  const SELECTOR_ROOT = ":" + ROOT;

  const MIRROR = {
    [TOP]: BOTTOM,
    [BOTTOM]: TOP,
    [LEFT]: RIGHT,
    [RIGHT]: LEFT,
    [START]: END,
    [END]: START,
    [WIDTH]: HEIGHT,
    [HEIGHT]: WIDTH,
    x: "y",
    y: "x",
  };

  var isArray = Array.isArray;

  var isElement = (value) => value && !!value.getElementsByClassName;

  var isFunction = (value) => typeof value === "function";

  var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

  var isIterable = (value) => value && !!value[Symbol.iterator] && !isString(value);

  var isNumber = (value) => typeof value === "number";

  var isObject = (value) => value && value.constructor === Object;

  var isString = (value) => typeof value === "string";

  var addClass = (elem, classes) => toggleClass(elem, classes, true);

  var arrayFrom = Array.from;

  var arrayUnique = (array) =>
    array.length > 1 ? arrayFrom(new Set(array)) : array;

  var callOrReturn = (value, ...data) => (isFunction(value) ? value(...data) : value);

  const cache = {};
  var camelToKebab = (str = "") =>
    cache[str] ||
    (cache[str] = str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase());

  var checkHash = (id) => window.location.hash.substring(1) === id;

  var createElement = (type = DIV, props, ...content) => {
    const elem = doc.createElement(type);
    if (props) {
      if (isString(props)) {
        props = { class: props };
      }
      Object.entries(props).forEach(([name, value]) => {
        if (name === CLASS) {
          addClass(elem, value);
        } else if (name === STYLE) {
          addStyle(elem, value);
        } else {
          setAttribute(elem, camelToKebab(name), value);
        }
      });
    }
    content.forEach((item) => item && elem.append(item));
    return elem;
  };

  var createInset = (input, returnArray) => {
    let top = 0,
      right = 0,
      bottom = 0,
      left = 0;
    if (isNumber(input)) {
      top = right = bottom = left = input;
    } else if (isArray(input)) {
      if (input.length === 1) {
        top = right = bottom = left = input[0];
      } else if (input.length === 2) {
        top = bottom = input[0];
        right = left = input[1];
      } else if (input.length === 3) {
        top = input[0];
        right = left = input[1];
        bottom = input[2];
      } else {
        top = input[0];
        right = input[1];
        bottom = input[2];
        left = input[3];
      }
    } else if (isObject(input)) {
      top = input.top || 0;
      right = input.right || 0;
      bottom = input.bottom || 0;
      left = input.left || 0;
    }
    if (returnArray) {
      return [top, right, bottom, left];
    } else {
      return { top, right, bottom, left };
    }
  };

  var getDataSelector = (...values) => `[${DATA_UI_PREFIX + values.join("-")}]`;

  function getOption (multiply, instance, option, root = doc, ...params) {
    if (!option) return;
    option = callOrReturn(option, instance, ...params);
    if (isString(option)) {
      option = root[multiply ? "querySelectorAll" : "querySelector"](option);
    }
    return multiply ? returnArray(option).filter(Boolean) : option;
  }

  var getOptionElem = (...params) => getOption(false, ...params);

  var getOptionElems = (...params) => getOption(true, ...params);

  const { min, max } = Math;

  function getPosition ({
    absolute,
    anchorRect,
    targetRect,
    arrow,
    placement,
    boundaryOffset = 0,
    offset = 0,
    padding = 0,
    shrink = false,
    flip = true,
    sticky = false,
    minWidth = 0,
    minHeight = 0,
  }) {
    boundaryOffset = createInset(boundaryOffset);

    const viewRect = visualViewport;

    if (absolute) {
      flip = false;
      shrink = false;
      sticky = false;
    }

    flip = isArray(flip) ? flip : [flip];
    flip[1] ??= flip[0];

    padding = isArray(padding) ? padding : [padding];
    padding[1] ??= padding[0];

    const [baseM, baseS = CENTER] = placement.split("-");
    const hor = baseM === LEFT || baseM === RIGHT;

    const size = hor ? WIDTH : HEIGHT;
    const dir = hor ? LEFT : TOP;
    const dirS = hor ? TOP : LEFT;

    const minRect = { [WIDTH]: minWidth, [HEIGHT]: minHeight };

    let useFlipM = null;
    let useFlipS = null;

    function calculate() {
      const m = (useFlipM && MIRROR[baseM]) || baseM;
      const s = (useFlipS && MIRROR[baseS]) || baseS;

      const isStart = s === START;
      const isEnd = s === END;
      const isCenter = s === CENTER;
      const isMainDir = m === dir;
      const sumPadding = padding[0] + padding[1];
      const mirrorSize = MIRROR[size];
      const mirrorDirS = MIRROR[dirS];

      const anchorSpace = {
        [TOP]: anchorRect[TOP],
        [LEFT]: anchorRect[LEFT],
        [RIGHT]: viewRect[WIDTH] - anchorRect[RIGHT],
        [BOTTOM]: viewRect[HEIGHT] - anchorRect[BOTTOM],
      };

      anchorSpace[m] -= offset + boundaryOffset[m];
      anchorSpace[MIRROR[m]] -= boundaryOffset[dirS] + boundaryOffset[mirrorDirS];

      let awailableSizesOffset;
      if (sticky) {
        awailableSizesOffset = viewRect[mirrorSize] - sumPadding;
      } else {
        awailableSizesOffset = viewRect[mirrorSize] - anchorRect[mirrorSize] / 2;
        if (isStart) {
          awailableSizesOffset =
            anchorSpace[mirrorDirS] + anchorRect[mirrorSize] - sumPadding;
        } else if (isEnd) {
          awailableSizesOffset =
            anchorSpace[dirS] + anchorRect[mirrorSize] - sumPadding;
        }
      }

      const awailableSizes = {
        [size]: max(minRect[size], anchorSpace[m]),
        [mirrorSize]: max(minRect[mirrorSize], awailableSizesOffset),
      };

      const currentSize = {
        [size]: shrink
          ? min(targetRect[size], awailableSizes[size])
          : targetRect[size],
        [mirrorSize]: shrink
          ? min(targetRect[mirrorSize], awailableSizes[mirrorSize])
          : targetRect[mirrorSize],
      };

      if ((flip[0] || flip[1]) && useFlipM === null && useFlipS === null) {
        if (
          flip[0] &&
          targetRect[size] > anchorSpace[m] &&
          anchorSpace[m] < anchorSpace[MIRROR[m]]
        ) {
          useFlipM = true;
        }
        if (
          flip[1] &&
          anchorSpace[mirrorDirS] <
            targetRect[mirrorSize] -
              anchorRect[mirrorSize] +
              padding[0] +
              boundaryOffset[mirrorDirS]
        ) {
          useFlipS = true;
        }
        if (useFlipM || useFlipS) {
          return calculate();
        }
      }

      let mo;
      if (isMainDir) {
        mo = anchorRect[dir] - currentSize[size] - offset;
      } else {
        mo = anchorRect[MIRROR[dir]] + offset;
      }

      let so;
      if (isStart) {
        so = anchorRect[dirS] + padding[0];
      } else if (isCenter) {
        so =
          anchorRect[dirS] -
          (currentSize[mirrorSize] - anchorRect[mirrorSize]) / 2;
      } else {
        so = anchorRect[mirrorDirS] - currentSize[mirrorSize] - padding[1];
      }

      const staticSo = so;
      if (sticky) {
        if (so < boundaryOffset[dirS]) {
          if (!isStart) {
            so = boundaryOffset[dirS];
            if (anchorRect[dirS] < boundaryOffset[dirS] - padding[0]) {
              so = anchorRect[dirS] + padding[0];
            }
          }
        } else if (
          so + currentSize[mirrorSize] + boundaryOffset[mirrorDirS] >
          viewRect[mirrorSize]
        ) {
          if (!isEnd) {
            so -=
              so +
              currentSize[mirrorSize] -
              viewRect[mirrorSize] +
              boundaryOffset[mirrorDirS];
            if (
              anchorSpace[mirrorDirS] <
              -padding[1] + boundaryOffset[mirrorDirS]
            ) {
              so -=
                anchorSpace[mirrorDirS] + padding[1] - boundaryOffset[mirrorDirS];
            }
          }
        }
      }

      const shift = staticSo - so;

      let arrowPosition = {};
      if (arrow) {
        let { padding = 0, offset = 0 } = arrow;
        padding = isArray(padding) ? padding : [padding];
        padding[1] ??= padding[0];

        let so;
        if (isStart) {
          so = padding[0];
        } else if (isCenter) {
          so = currentSize[mirrorSize] / 2 - arrow[mirrorSize] / 2;
        } else {
          so = currentSize[mirrorSize] - padding[1] - arrow[mirrorSize];
        }

        so += shift + max(0, -currentSize[mirrorSize] / 2);
        let mo = -arrow[mirrorSize] / 2 + offset;
        if (isMainDir) {
          mo += currentSize[size];
        }
        arrowPosition = hor ? [mo, so] : [so, mo];
      }

      let transformOrigin;
      if (arrow) {
        transformOrigin = arrowPosition;
      } else {
        const mo = isStart
          ? padding[0]
          : isEnd
          ? currentSize[mirrorSize] - padding[1]
          : currentSize[MIRROR[size]] / 2;
        const so = isMainDir ? currentSize[size] : 0;
        transformOrigin = hor ? [so, mo] : [mo, so];
      }

      return {
        [dir]: mo,
        [dirS]: so,
        [AVAILABLE_WIDTH]: awailableSizes[WIDTH],
        [AVAILABLE_HEIGHT]: awailableSizes[HEIGHT],
        arrow: arrowPosition,
        placement: useFlipM ? MIRROR[placement] : placement,
        transformOrigin,
      };
    }
    return calculate();
  }

  var isOverflowElement = (elem) => {
    const { overflow, overflowX, overflowY, display } = getComputedStyle(elem);
    return (
      !/inline|contents/.test(display) &&
      /auto|hidden|scroll|overlay|clip/.test(overflow + overflowY + overflowX)
    );
  };

  const UNFOCUSABLE_SELECTORS = `${SELECTOR_DISABLED},${SELECTOR_INERT}`;
  var isUnfocusable = (elem) => elem.matches(UNFOCUSABLE_SELECTORS);

  function mergeDeep(...objects) {
    const result = {};
    for (const object of objects.filter(Boolean)) {
      for (const [key, value] of Object.entries(object)) {
        if (isObject(result[key])) {
          result[key] = isObject(value) ? mergeDeep(result[key], value) : value;
        } else if (isArray(result[key])) {
          result[key] = isArray(value) ? [...result[key], ...value] : value;
        } else if (value !== undefined) {
          result[key] = value;
        }
      }
    }
    return result;
  }

  var normalizeToggleParameters = (animated = true) =>
    isObject(animated) ? { animated: true, ...animated } : { animated };

  const resizeObserver = new ResizeObserver((entries) => {
    for (const { borderBoxSize, target } of entries) {
      const { blockSize, inlineSize } = borderBoxSize[0];
      target.__resizeCallback__(inlineSize, blockSize);
    }
  });
  function observeResize(target, fn) {
    target.__resizeCallback__ = fn;
    resizeObserver.observe(target, { box: "border-box" });
  }

  var replaceWord = (str, word) =>
    str
      .split(" ")
      .filter((w) => w !== word)
      .join(" ");

  var returnArray = (elem) =>
    elem !== undefined ? (isIterable(elem) ? arrayFrom(elem) : [elem]) : [];

  var strToArray = (str = "", separator = " ") =>
    str ? (isArray(str) ? str : str.split(separator)).filter(Boolean) : [];

  var toMs = (time) => {
    if (!time) return;
    let num = parseFloat(time);
    let unit = time.match(/m?s/);
    if (unit) {
      unit = unit[0];
    }
    if (unit === "s") {
      num *= 1000;
    }
    return num;
  };

  var uuidGenerator = (prefix = "") =>
    prefix + Math.random().toString(36).substring(2, 12);

  var without = (source, ...values) =>
    returnArray(source).filter((elem) => !values.includes(elem));

  var updateOptsByData = (opts, dataset, names) => {
    names.forEach((name) => {
      let optionName = name;
      let attributeName = name;
      if (isArray(name)) {
        optionName = name[0];
        attributeName = name[1];
      }
      let value = dataset[UI + upperFirst(attributeName)];
      const hasAttribute = value !== undefined;
      if (hasAttribute) {
        if (OPTIONS_BOOLEAN.includes(optionName)) {
          value = hasAttribute;
        } else if (value && value[0] === "{") {
          value = JSON.parse(value);
        }
        opts[optionName] = value;
      }
    });
    return opts;
  };

  var getEventsPrefix = (name) => UI_PREFIX + name + ":";

  var getClassActive = (name) => UI_PREFIX + (name ? name + "-" : "") + ACTIVE;

  var getDefaultToggleSelector = (id, multiply) =>
    `[${DATA_UI_PREFIX + ACTION_TOGGLE}${
    multiply ? "~" : ""
  }="${id}"],[href="#${id}"]`;

  const DEFAULT_PREFIX = upperFirst(DEFAULT);
  var updateModule = ({ opts, constructor }, name, property = false, defaults) => {
    const defaultValue = constructor[DEFAULT_PREFIX + upperFirst(name)];
    let value = opts[name];
    if (defaults && value && isString(value)) {
      value = defaults[value];
    }
    if (isObject(value)) {
      opts[name] = { ...defaultValue, ...value };
    } else if (value) {
      opts[name] = { ...defaultValue };
      if (property) {
        opts[name][property] = value;
      }
    }
    return opts;
  };

  function addStyle(elem, name, value) {
    if (isIterable(elem)) {
      elem.forEach((elem) => addStyle(elem, name, value));
    } else {
      if (isObject(name)) {
        for (const key in name) addStyle(elem, key, name[key]);
      } else {
        elem.style.setProperty(camelToKebab(name), value);
      }
    }
  }

  var closest = (elem, selectors) =>
    getElements(selectors).find((t) => t === elem || t.contains(elem));

  var dir = (elem, property, selector, until) => {
    const utilIsFn = isFunction(until);
    return map(elem, (el) => {
      const elems = [];
      while (el) {
        el = el[property];
        if (el) {
          if (until && (utilIsFn ? until(el) : is(el, until))) break;
          elems.push(el);
        }
      }
      return filter(elems, selector);
    }).flat();
  };

  var each = (elems, fn) => {
    elems = getElements(elems);
    elems.forEach(fn);
    return elems;
  };

  var filter = (elems, selector) => {
    const isFn = isFunction(selector);
    elems = arrayFrom(elems);
    return selector
      ? elems.filter((elem, i, list) =>
          isFn ? selector(elem, i, list) : is(elem, selector),
        )
      : elems;
  };

  var focus = (elem, opts = { preventScroll: true }) =>
    elem && elem.focus(opts);

  var fragment = (html, findSelectors) => {
    let children = html;
    if (isString(html)) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      if (findSelectors) {
        return arrayFrom(doc.querySelectorAll(findSelectors));
      }
      children = doc.body.children;
    }
    return children
      ? children.length > 1
        ? arrayFrom(children)
        : children[0]
      : "";
  };

  var getElement = (selector, context, findSelf) =>
    getElements(selector, context, findSelf)[0];

  function getElements(selector, context = doc, findSelf = false) {
    if (isElement(selector)) {
      return [selector];
    }
    let result = selector;
    if (isString(context)) {
      context = getElement(context);
    }
    if (!isElement(context) || !selector) return [];
    if (isString(selector)) {
      selector = selector.trim();
      if (selector === DOCUMENT) {
        result = doc;
      } else if (selector === WINDOW) {
        result = window;
      } else if (isHTML(selector)) {
        result = fragment(selector);
      } else {
        result = context.querySelectorAll(selector);
      }
    } else if (isIterable(selector)) {
      result = arrayFrom(selector, (item) => getElements(item, context)).flat();
    }

    result = returnArray(result);

    if (findSelf && is(context, selector)) {
      result.unshift(context);
    }
    return arrayUnique(result).filter(Boolean);
  }

  var inDOM = (elem) => elem && body.contains(elem);

  var is = (elem, selector) =>
    elem === selector
      ? true
      : isString(selector)
      ? elem.matches(selector)
      : isIterable(selector)
      ? arrayFrom(selector).includes(elem)
      : isFunction(selector) && selector(elem);

  var map = (elems, fn) => getElements(elems).map(fn);

  var next = (elem, selector) => nextAll(elem, selector)[0];

  var nextAll = (elem, selector, until) =>
    dir(elem, "nextElementSibling", selector, until);

  var parents = (elem, selector, until) =>
    dir(elem, "parentElement", selector, until);

  var removeAttribute = (elem, names) => {
    names = strToArray(names);
    if (isIterable(elem)) {
      elem.forEach((elem) =>
        names.forEach((name) => elem && elem.removeAttribute(name)),
      );
    } else {
      names.forEach((name) => elem && elem.removeAttribute(name));
    }
  };

  var removeClass = (elem, classes) => toggleClass(elem, classes, false);

  function setAttribute(elem, name, value) {
    if (!elem) return;
    if (isArray(elem)) {
      return elem.forEach((elem) => setAttribute(elem, name, value));
    }
    if (isFunction(value)) {
      value = value(elem.getAttribute(name));
    }
    if (value === null) {
      elem.removeAttribute(name);
    } else if (value !== undefined) {
      elem.setAttribute(name, value);
    }
  }

  function toggleClass(elem, classes, s) {
    if (isArray(classes)) {
      classes = classes.filter(Boolean).join(" ");
    }
    const cls = strToArray(classes);
    if (isElement(elem)) {
      s ??= !elem.classList.contains(cls[0]);
      elem.classList[s ? ACTION_ADD : ACTION_REMOVE](...cls);
    } else if (isIterable(elem)) {
      elem.forEach((el) => toggleClass(el, cls, s));
    }
  }

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

  function getDataValue(_data, dataName, elem) {
    const value = callOrReturn(_data[dataName], elem);
    if (!isObject(value)) return {};
    return _data[value.data]
      ? { ...getDataValue(_data, value.data, elem), ...value }
      : value;
  }

  class Base {
    static allInstances = new Map();
    constructor(elem, opts) {
      if (isFunction(opts)) {
        opts = opts(elem);
      }
      opts ??= {};
      const { NAME, BASE_NODE_NAME, Default, _data, _templates, allInstances } =
        this.constructor;
      const baseElemName = BASE_NODE_NAME ?? NAME;

      let dataName = opts.data;
      let datasetValue, isDataObject;

      if (elem == null) {
        opts = mergeDeep(Default, getDataValue(_data, dataName, elem), opts);
        elem = isString(opts.template)
          ? callOrReturn(_templates[opts.template], opts)
          : opts.template(opts);
        this._fromTemplate = true;
      } else if (elem) {
        if (isHTML(elem)) {
          elem = fragment(elem);
          this._fromHTML = true;
        } else if (isString(elem)) {
          elem = doc.querySelector(elem);
        }
        datasetValue = elem.getAttribute(DATA_UI_PREFIX + NAME)?.trim() || "";
        isDataObject = datasetValue[0] === "{";
        dataName ||= !isDataObject && datasetValue;

        datasetValue = isDataObject ? JSON.parse(datasetValue) : {};

        if (dataName && !_data[dataName]) return;

        opts = mergeDeep(
          Default,
          getDataValue(_data, dataName, elem),
          datasetValue,
          opts,
        );
      }
      elem = getElement(elem);

      if (!elem) return;

      this[baseElemName] = elem;

      this.baseOpts = this.opts = opts;

      this.id = elem.id ||= this.uuid = uuidGenerator(NAME + "-");
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
            this.opts = breakpoint[1]
              ? mergeDeep(opts, breakpoint[0])
              : { ...opts };
            delete this.opts.breakpoints;
            if (opts.destroy) {
              this.destroy();
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
  }

  var ToggleMixin = (Base, NAME) =>
    class extends Base {
      static _data = {};
      static instances = new Map();
      static get NAME() {
        return NAME;
      }
      get isAnimating() {
        return this.transition.isAnimating;
      }
      get initialPlaceNode() {
        return (
          this.teleport?.placeholder ?? this.transition?.placeholder ?? this.base
        );
      }
      hide(opts) {
        return this.toggle(false, opts);
      }
      show(opts) {
        return this.toggle(true, opts);
      }
      static toggle(id, s, opts) {
        return this.instances.get(id)?.toggle(s, opts);
      }
      static show(id, opts) {
        return this.instances.get(id)?.show(opts);
      }
      static hide(id, opts) {
        return this.instances.get(id)?.hide(opts);
      }
    };

  const HIDDEN_CLASS = UI_PREFIX + HIDDEN;
  // const SHOWN_CLASS = UI_PREFIX + SHOWN;
  const DATASET_DURATION = UI + upperFirst(DURATION);
  const DATASET_DURATION_ENTER = DATASET_DURATION + upperFirst(ENTER);
  const DATASET_DURATION_LEAVE = DATASET_DURATION + upperFirst(LEAVE);
  const OPTION_SHOWN_CLASS = SHOWN + upperFirst(CLASS);
  const OPTION_HIDDEN_CLASS = HIDDEN + upperFirst(CLASS);

  class Transition {
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
      this.animations?.forEach((animation) => animation.cancel());
      return Promise.allSettled([this.getAwaitPromise()]);
    }
    getAwaitPromise() {
      return Promise.allSettled(this.promises);
    }
    toggleRemove(s) {
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
          await this.getAwaitPromise();
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
      this.opts = updateOptsByData(opts, dataset, TELEPORT_DATA_ATTRIBUTES);
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
        : opts !== false || elem.dataset[TELEPORT_DATA_ATTRIBUTE]
        ? new Teleport(elem, opts, defaultOpts)
        : null;
    }
  }

  const eventName$1 = EVENT_CLICK + "." + DISMISS;
  function addDismiss (
    instance,
    elem = instance.base,
    action = instance.hide,
  ) {
    if (instance._dismiss) {
      instance.off(elem, eventName$1);
    }
    if (instance.opts[DISMISS]) {
      instance.on(
        elem,
        eventName$1,
        isString(instance.opts[DISMISS])
          ? instance.opts[DISMISS]
          : `[${DATA_UI_PREFIX + DISMISS}=""],[${DATA_UI_PREFIX + DISMISS}="${
            instance.constructor.NAME
          }"]`,
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          action({ event, trigger: event.deligateTarget });
        },
      );
      instance._dismiss = true;
    }
  }

  const eventName = EVENT_KEYDOWN + ".escapeHide";

  function addEscapeHide (instance, s, elem = instance.base) {
    if (s) {
      instance.on(elem, eventName, (event) => {
        if (event.keyCode === KEY_ESC) {
          (instance.opts.escapeHide.stop ?? true) && event.stopPropagation();
          instance.hide({ event });
          instance.emit(CANCEL, { event });
        }
      });
    } else {
      instance.off(elem, eventName);
    }
  }

  const FOCUSABLE_ELEMENTS_SELECTOR = `:is(:is(a,area)[href],:is(select,textarea,button,input:not([type="hidden"])):not(disabled),details:not(:has(>summary)),iframe,:is(audio,video)[controls],[contenteditable],[tabindex]):not([inert],[inert] *,[tabindex^="-"])`;
  var callAutofocus = (instance, elem = instance.base) => {
    const autofocus = instance.opts.autofocus;
    if (elem.contains(doc.activeElement)) return;
    let focusElem = getOptionElem(instance, autofocus.elem, elem);
    const isDialog = elem.tagName === "DIALOG";
    if ((!focusElem && autofocus.required && !isDialog) || isDialog) {
      focusElem = elem.querySelector(FOCUSABLE_ELEMENTS_SELECTOR);
      if (!focusElem && elem.hasAttribute(TABINDEX)) {
        focusElem = elem;
      }
    }

    focusElem?.focus({
      [OPTION_PREVENT_SCROLL]: autofocus[OPTION_PREVENT_SCROLL] ?? false,
    });
  };

  var addOutsideHide = (instance, s, activeElems) => {
    if (s) {
      instance.on(doc, EVENT_ACTION_OUTSIDE, (event) => {
        !closest(event.target, activeElems) && instance.hide({ event });
      });
    } else {
      instance.off(doc, EVENT_ACTION_OUTSIDE);
    }
  };

  var baseDestroy = (
    instance,
    {
      remove = false,
      keepInstance = false,
      destroyTransition = true,
      destroyTeleport = true,
    } = {},
  ) => {
    const {
      base,
      off,
      emit,
      autohide,
      transition,
      floating,
      teleport,
      id,
      uuid,
      instances,
      breakpoints,
    } = instance;

    if (autohide) {
      autohide.destroy();
      instance.autohide = null;
    }
    if (floating) {
      floating.destroy();
      instance.floating = null;
    }
    if (destroyTransition && transition) {
      transition.destroy();
      if (instance.constructor.NAME === MODAL) {
        instance.transitions = null;
      } else {
        instance.transition = null;
      }
    }
    if (destroyTeleport && teleport) {
      teleport.destroy();
      instance.teleport = null;
    }

    off();

    if (!keepInstance) {
      base.id.includes(uuid) && base.removeAttribute(ID);
      breakpoints?.destroy();
      instances.delete(id);
    }
    if (remove) {
      base.remove();
    }

    emit(EVENT_DESTROY);
    instance.isInit = false;
    return instance;
  };

  var toggleOnInterection = ({
    anchor,
    target,
    instance,
    trigger,
    action = instance.toggle,
    delay,
  }) => {
    const { opts, on } = instance;
    trigger ??= opts.trigger;
    delay ??= opts.delay;

    if (!trigger) return;

    const triggerClick = trigger.includes(CLICK);
    const triggerHover = trigger.includes(HOVER);
    const triggerFocus = trigger.includes(FOCUS);
    const events = [];
    if (triggerHover || triggerFocus) {
      delay = isArray(delay) ? delay : [delay, delay];
    }
    if (triggerClick) {
      on(anchor, EVENT_CLICK, (event) =>
        action(null, { event, trigger: anchor }),
      );
    }
    if (triggerHover) {
      events.push(EVENT_MOUSEENTER, EVENT_MOUSELEAVE);
    }
    if (triggerFocus) {
      events.push(EVENT_FOCUSIN, EVENT_FOCUSOUT);
    }
    if (triggerHover || triggerFocus) {
      on([anchor, target], events, (event) => {
        const { type, target } = event;
        const isFocus = type === EVENT_FOCUSIN || type === EVENT_FOCUSOUT;
        const entered =
          (triggerHover && type === EVENT_MOUSEENTER) ||
          (triggerFocus && type === EVENT_FOCUSIN);
        const d = isFocus ? 0 : delay[entered ? 0 : 1];
        clearTimeout(instance._hoverTimer);
        if (d) {
          instance._hoverTimer = setTimeout(
            () => action(entered, { trigger: anchor, event }),
            d,
          );
        } else {
          action(entered, { event, trigger: target });
        }
      });
    }
  };

  const CLIP_PATH_PROPERTY = CSS.supports(CLIP_PATH + ":" + NONE)
    ? CLIP_PATH
    : WEBKIT_PREFIX + CLIP_PATH;
  const valuesToArray = ({ value }) => value.trim().split(" ").map(parseFloat);
  const registerProperty = CSS.registerProperty;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const getBoundingClientRect = (elem, useScale) => {
    const rect = elem.getBoundingClientRect().toJSON();

    if (!useScale) return rect;

    const vV = visualViewport;
    const hasScale = vV.scale > 1.01 || vV.scale < 0.99;
    const iosScale = window.innerWidth / document.documentElement.clientWidth;
    const hasIosScale = iosScale > 1.01 || iosScale < 0.99;
    const keyboardOpen = vV.height !== window.innerHeight;

    if (
      (!hasScale && hasIosScale) ||
      (keyboardOpen && hasScale && hasIosScale) ||
      (!hasScale && keyboardOpen && isIOS)
    ) {
      rect[TOP] += vV.offsetTop;
      rect[LEFT] += vV.offsetLeft;
      rect[RIGHT] = rect[LEFT] + rect[WIDTH];
      rect[BOTTOM] = rect[TOP] + rect[HEIGHT];
    }

    return rect;
  };

  let css = "";
  [TOOLTIP, DROPDOWN, POPOVER].forEach((name) => {
    const PREFIX = VAR_UI_PREFIX + name + "-";
    [
      STICKY,
      FLIP,
      SHRINK,
      PLACEMENT,
      PADDING,
      OFFSET,
      BOUNDARY_OFFSET,
      ARROW_OFFSET,
      ARROW_PADDING,
    ].forEach((prop) => {
      if (registerProperty) {
        registerProperty({
          name: PREFIX + prop,
          syntax: "*",
          inherits: false,
        });
      } else {
        css += PREFIX + prop + ":;";
      }
    });
  });
  if (!registerProperty) {
    doc.head.appendChild(createElement(STYLE, false, `*{${css}}`));
  }

  const DIALOG_MODE = MODAL + "-" + POPOVER;

  class Floating {
    constructor({ target, anchor, arrow, opts, root = body, name = "" }) {
      const { on, off } = new EventHandler();
      Object.assign(this, { target, anchor, arrow, opts, root, name, on, off });
    }
    recalculate() {
      const { target, anchor, arrow, opts, name } = this;
      const anchorScrollParents = parents(anchor, isOverflowElement);
      const targetStyles = getComputedStyle(target);
      const anchorStyles = getComputedStyle(anchor);
      const PREFIX = VAR_UI_PREFIX + name + "-";
      let pendingUpdate = false;

      const minHeight = parseFloat(targetStyles.minHeight);
      const minWidth = parseFloat(targetStyles.minWidth);

      let [sticky, flip, shrink, placement] = [
        STICKY,
        FLIP,
        SHRINK,
        PLACEMENT,
      ].map(
        (name) =>
          anchorStyles.getPropertyValue(PREFIX + name).trim() ||
          targetStyles.getPropertyValue(PREFIX + name).trim(),
      );

      flip = flip
        ? flip.split(" ").map((v) => v === TRUE)
        : returnArray(opts[FLIP]);
      sticky = sticky ? sticky === TRUE : opts[STICKY];
      shrink = shrink ? shrink === TRUE : opts[SHRINK];

      placement ||= opts[PLACEMENT];

      const absolute = opts.mode === ABSOLUTE;
      const valuesNames = [
        PADDING,
        OFFSET,
        BOUNDARY_OFFSET,
        ARROW_OFFSET,
        ARROW_PADDING,
      ];
      const values = valuesNames
        .map((name) => {
          let value =
            anchorStyles.getPropertyValue(PREFIX + name).trim() ||
            targetStyles.getPropertyValue(PREFIX + name).trim();
          if (!value) return;
          value = value.split(" ");
          if (name === BOUNDARY_OFFSET) {
            value = createInset(value, true);
          } else {
            value[1] ??= value[0];
          }
          return { name, value };
        })
        .filter(Boolean);

      const polygonValues = values
        .map(({ name, value }) => {
          if (name === BOUNDARY_OFFSET) {
            const valueEnd = value.splice(2).join(" ");
            value = value.join(" ");
            return [value, valueEnd].join(",");
          }
          return value.join(" ");
        })
        .join(",");

      const wrapper = this.createWrapper(
        values.length
          ? { [CLIP_PATH_PROPERTY]: `polygon(${polygonValues})` }
          : {},
      );
      const wrapperComputedStyle = getComputedStyle(this.wrapper);
      const wrapperStyle = wrapper.style;

      const computedValues = wrapperComputedStyle[CLIP_PATH_PROPERTY].slice(8, -1)
        .split(",")
        .values();

      const {
        padding,
        offset = opts.offset,
        boundaryOffset = opts.boundaryOffset,
        arrowPadding = opts[ARROW]?.padding ?? 0,
        arrowOffset = opts[ARROW]?.offset ?? 0,
      } = values.length
        ? Object.fromEntries(
            values.map(({ name }) => {
              let value = valuesToArray(computedValues.next());
              if (name === BOUNDARY_OFFSET) {
                value = [...value, ...valuesToArray(computedValues.next())];
              } else if (name === OFFSET || name === ARROW_OFFSET) {
                value = value[0];
              }
              return [kebabToCamel(name), value];
            }),
          )
        : {};

      if (values.length) {
        wrapperStyle.removeProperty(CLIP_PATH_PROPERTY);
      }

      const arrowRect = arrow && getBoundingClientRect(arrow);
      let anchorRect = getBoundingClientRect(arrow, !absolute);

      const targetRect = {};
      [WIDTH, HEIGHT].forEach((size) => {
        targetRect[size] = parseFloat(wrapperComputedStyle[size]);
        wrapperStyle.setProperty(PREFIX + size, targetRect[size] + PX);
        wrapperStyle.setProperty(
          PREFIX + ANCHOR + "-" + size,
          anchorRect[size] + PX,
        );
      });

      const arrowData = arrow && {
        [WIDTH]: arrowRect[WIDTH],
        [HEIGHT]: arrowRect[HEIGHT],
        [PADDING]: arrowPadding,
        [OFFSET]: arrowOffset,
      };

      const params = {
        anchorRect,
        targetRect,
        arrow: arrowData,
        placement,
        absolute,
        flip,
        sticky,
        shrink,
        offset,
        boundaryOffset,
        padding,
        minHeight,
        minWidth,
      };

      const updatePosition = () => {
        if (pendingUpdate) return;
        pendingUpdate = true;

        anchorRect = getBoundingClientRect(anchor, !absolute);

        if (absolute) {
          anchorRect.left = anchor.offsetLeft;
          anchorRect.top = anchor.offsetTop;
          anchorRect.right = anchor.offsetLeft + anchorRect.width;
          anchorRect.bottom = anchor.offsetTop + anchorRect.height;
        }

        const position = getPosition({ ...params, anchorRect });

        setAttribute(
          wrapper,
          DATA_UI_PREFIX + "current-" + PLACEMENT,
          position.placement,
        );

        if (shrink) {
          [AVAILABLE_WIDTH, AVAILABLE_HEIGHT].forEach((name) =>
            wrapperStyle.setProperty(PREFIX + name, position[name] + PX),
          );
        }
        if (arrow) {
          [LEFT, TOP].forEach((dir, i) =>
            wrapperStyle.setProperty(
              PREFIX + ARROW + "-" + dir,
              position.arrow[i] + PX,
            ),
          );
        }
        wrapperStyle.setProperty(
          PREFIX + "transform-origin",
          position.transformOrigin[0] +
            PX +
            " " +
            position.transformOrigin[1] +
            PX,
        );

        wrapperStyle.transform = `translate3d(${position.left}px,${position.top}px,0)`;

        requestAnimationFrame(() => {
          pendingUpdate = false;
        });
      };

      observeResize(target, (width, height) => {
        targetRect[WIDTH] = width;
        targetRect[HEIGHT] = height;
        updatePosition();
      });

      updatePosition();

      this.on(
        anchorScrollParents,
        EVENT_SCROLL,
        () => {
          updatePosition();
        },
        {
          passive: true,
        },
      );
      this.on(visualViewport, [EVENT_SCROLL, EVENT_RESIZE], updatePosition, {
        passive: false,
      });
      this.on(window, EVENT_SCROLL, updatePosition, {
        passive: true,
      });
      this.updatePosition = updatePosition.bind(this);
      return this;
    }

    createWrapper(style = {}) {
      const {
        target,
        root,
        name,
        on,
        off,

        opts: { mode, interactive, focusTrap, escapeHide },
      } = this;
      const attributes = {
        style: {
          position: mode === ABSOLUTE ? ABSOLUTE : FIXED,
          top: 0,
          left: 0,
          zIndex: 999,
          margin: 0,
          padding: 0,
          background: NONE,
          maxWidth: NONE,
          maxHeight: NONE,
          willChange: "transform",
          width: "fit-content",
          height: "fit-content",
          minWidth: "max-content",
          display: "block",
          overflow: "unset",
          ...style,
        },
        [FLOATING_DATA_ATTRIBUTE]: "",
        [DATA_PREFIX + UI_PREFIX + name + "-wrapper"]: "",
      };

      if (interactive !== undefined && !interactive) {
        attributes[INERT] = "";
        attributes.style.pointerEvents = NONE;
      }
      const wrapper = (this.wrapper = createElement(
        mode === DIALOG_MODE ? DIALOG : DIV,
        attributes,
        target,
      ));
      root.append(wrapper);
      if (mode === DIALOG_MODE) {
        if (focusTrap) {
          wrapper.showModal();
        } else {
          wrapper.show();
        }
        if (escapeHide) {
          on(wrapper, CANCEL, (e) => e.preventDefault());
        } else {
          off(wrapper, CANCEL);
        }
      }
      return wrapper;
    }
    destroy() {
      this.off();
      resizeObserver.unobserve(this.target);
      this.wrapper.close?.();
      this.wrapper.remove();
    }
  }

  var floatingTransition = (instance, { s, animated, silent, eventParams }) => {
    const { transition, base, opts, toggler, emit, constructor } = instance;
    const name = constructor.NAME;
    const target = instance[name];
    const transitionParams = { allowRemove: false };
    transition.parent = null;

    if (!silent && !s) {
      emit(EVENT_HIDE, eventParams);
    }

    if (s) {
      transitionParams[EVENT_SHOW] = () => {
        const root = target.parentNode;
        const arrow = target.querySelector(getDataSelector(name, ARROW));

        instance.floating = new Floating({
          anchor: toggler ?? base,
          target,
          arrow,
          opts,
          root,
          name,
        }).recalculate();

        if (!silent) {
          emit(EVENT_SHOW, eventParams);
        }
      };
    }

    !s && instance?.floating?.wrapper.close?.();

    const promise = transition.run(s, animated, transitionParams);

    if (s) {
      opts.outsideHide && addOutsideHide(instance, s, [toggler ?? base, target]);
      opts.escapeHide && addEscapeHide(instance, s, doc);
    }

    !s &&
      (async () => {
        if (animated) {
          await promise;
        }
        if (transition.placeholder) {
          instance.floating.wrapper.replaceWith(transition.placeholder);
        }
        instance.floating?.destroy();
        instance.floating = null;
      })();

    return promise;
  };

  var callInitShow = (instance, elem = instance.base) => {
    const { opts, transition, show, id } = instance;

    instance.instances.set(id, instance);
    instance.isInit = true;
    instance.emit(EVENT_INIT);

    const shown =
      callOrReturn(
        (opts.hashNavigation && checkHash(id)) || opts.shown,
        instance,
      ) ?? transition.isShown;

    shown &&
      show({
        animated: opts.appear ?? elem.hasAttribute(DATA_APPEAR),
        ignoreConditions: true,
      });

    return instance;
  };

  var awaitPromise = async (promise, callback) => {
    await promise;
    callback();
  };

  const COLLAPSE = "collapse";

  class Collapse extends ToggleMixin(Base, COLLAPSE) {
    static Default = {
      ...DEFAULT_OPTIONS,
      eventPrefix: getEventsPrefix(COLLAPSE),
      hashNavigation: true,
      dismiss: true,
      [TOGGLER]: ({ id }) => getDefaultToggleSelector(id, true),
      [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [COLLAPSE + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    };

    constructor(elem, opts) {
      super(elem, opts);
    }
    _update() {
      const { base, opts, transition, teleport } = this;

      addDismiss(this);

      this.teleport = Teleport.createOrUpdate(
        teleport,
        base,
        opts.teleport,
      )?.move(this);

      this.transition = Transition.createOrUpdate(
        transition,
        base,
        opts.transition,
      );

      this.updateTriggers();

      return this;
    }
    destroy(destroyOpts) {
      // eslint-disable-next-line prefer-const
      let { opts, togglers } = this;

      if (!this.isInit) return;

      this.emit(EVENT_BEFORE_DESTROY);

      if (opts.a11y) {
        const otherTogglers = arrayFrom(this.instances.values())
          .filter((item) => item !== this)
          .flatMap((item) => item.togglers.filter((t) => togglers.includes(t)));
        if (otherTogglers.length) {
          togglers = togglers.filter((toggler) => {
            if (!otherTogglers.includes(toggler)) {
              return true;
            } else {
              setAttribute(toggler, ARIA_CONTROLS, (v) =>
                replaceWord(v, this.id),
              );
            }
          });
        }
      }

      opts.a11y &&
        removeAttribute(togglers, [ARIA_CONTROLS, ARIA_EXPANDED, ROLE]);

      baseDestroy(this, destroyOpts);

      return this;
    }

    init() {
      if (this.isInit) return;

      this.emit(EVENT_BEFORE_INIT);

      this._update();

      return callInitShow(this);
    }
    updateTriggers() {
      const { opts, id } = this;

      return (this.togglers = getOptionElems(this, opts[TOGGLER]).map(
        (toggler) => {
          if (!this.togglers?.includes(toggler)) {
            if (opts.a11y) {
              setAttribute(toggler, ARIA_CONTROLS, (v) =>
                v ? arrayUnique(v.split(" ").concat(id)).join(" ") : id,
              );
              if (toggler.tagName !== BUTTON.toLowerCase()) {
                setAttribute(toggler, ROLE, BUTTON);
              }
            }
            toggleClass(
              toggler,
              opts[TOGGLER + CLASS_ACTIVE_SUFFIX],
              !!this.isShown,
            );
            this.on(toggler, EVENT_CLICK, (event) => {
              event.preventDefault();
              this.toggle(null, { trigger: toggler, event });
            });
          }
          return toggler;
        },
      ));
    }
    async toggle(s, params) {
      const { base, transition, togglers, opts, emit, isShown, isAnimating } =
        this;
      const { awaitAnimation, a11y } = opts;
      const { animated, silent, trigger, event, ignoreConditions } =
        normalizeToggleParameters(params);

      s ??= !isShown;

      if (!ignoreConditions && ((awaitAnimation && isAnimating) || s === isShown))
        return;

      this.isShown = s;

      if (isAnimating && !awaitAnimation) {
        await transition.cancel();
      }

      const eventParams = { trigger, event };

      !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

      a11y && setAttribute(togglers, ARIA_EXPANDED, !!s);
      toggleClass(togglers, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);
      toggleClass(base, opts[COLLAPSE + CLASS_ACTIVE_SUFFIX], s);

      const promise = transition.run(s, animated, {
        [s ? EVENT_SHOW : EVENT_HIDE]: () =>
          !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams),
        [EVENT_DESTROY]: () =>
          this.destroy({ remove: true, destroyTransition: false }),
      });

      awaitPromise(promise, () =>
        emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams),
      );

      animated && awaitAnimation && (await promise);

      return this;
    }
  }

  class Dropdown extends ToggleMixin(Base, DROPDOWN) {
    static DefaultAutofocus = {
      elem: DEFAULT_AUTOFOCUS,
      required: false,
    };
    static Default = {
      ...DEFAULT_OPTIONS,
      ...DEFAULT_FLOATING_OPTIONS,
      focusTrap: true,
      itemClickHide: true,
      mode: false,
      autofocus: true,
      items: getDataSelector(DROPDOWN + "-item"),
      trigger: CLICK,
      [TOGGLER]: null,
      [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    };

    constructor(elem, opts) {
      super(elem, opts);
    }
    init() {
      if (this.isInit) return;
      this._update();

      const { toggler, dropdown, show, on } = this;

      toggleOnInterection({ anchor: toggler, target: dropdown, instance: this });
      addDismiss(this, dropdown);
      updateModule(this, AUTOFOCUS);

      on(dropdown, EVENT_KEYDOWN, this._onKeydown.bind(this));
      on(toggler, EVENT_KEYDOWN, async (event) => {
        const { keyCode, shiftKey } = event;

        const arrowActivated =
          KEY_ARROW_UP === keyCode || KEY_ARROW_DOWN === keyCode;
        if (
          arrowActivated ||
          (keyCode === KEY_TAB && !shiftKey && this.isShown)
        ) {
          event.preventDefault();
        }
        if (arrowActivated) {
          if (!this.isShown) {
            await show({ event, trigger: toggler });
          }
        }
        if (arrowActivated || (keyCode === KEY_TAB && !shiftKey)) {
          this.focusableElems[0]?.focus();
        }
      });

      return callInitShow(this, dropdown);
    }
    _update() {
      const { base, opts, transition, on, off, hide } = this;

      this.transition = Transition.createOrUpdate(
        transition,
        base,
        opts.transition,
        { [HIDE_MODE]: ACTION_REMOVE, keepPlace: false },
      );

      opts[MODE] =
        base.getAttribute(DATA_UI_PREFIX + DROPDOWN + "-" + MODE) ?? opts[MODE];

      this.updateToggler();

      if (opts.itemClickHide) {
        on(base, EVENT_CLICK, (event) => {
          const trigger = closest(event.target, this.focusableElems);
          trigger && hide({ event, trigger });
        });
      } else {
        off(base, EVENT_CLICK);
      }
    }
    updateToggler() {
      const { opts, id } = this;
      const toggler = (this.toggler = getOptionElem(
        this,
        opts.toggler ?? getDefaultToggleSelector(id),
      ));

      if (!toggler) return;
      opts.a11y && setAttribute(toggler, ARIA_CONTROLS, id);
      return this;
    }
    get focusableElems() {
      return getOptionElems(this, this.opts.items, this.dropdown).filter(
        (elem) => !isUnfocusable(elem),
      );
    }
    _onKeydown(event) {
      const { keyCode, shiftKey } = event;
      const isControl = [
        KEY_ENTER,
        KEY_SPACE,
        KEY_END,
        KEY_HOME,
        KEY_ARROW_LEFT,
        KEY_ARROW_UP,
        KEY_ARROW_RIGHT,
        KEY_ARROW_DOWN,
      ].includes(keyCode);
      const { toggler, focusableElems, hide, opts } = this;

      if (!isControl && keyCode !== KEY_TAB) {
        focusableElems
          .find((elem) => elem.textContent.toLowerCase().startsWith(event.key))
          ?.focus();
        return;
      }
      const firstIndex = 0;
      const lastIndex = focusableElems.length - 1;
      const currentIndex = focusableElems.findIndex(
        (elem) => elem === doc.activeElement,
      );

      if (currentIndex === 0 && shiftKey && keyCode === KEY_TAB) {
        event.preventDefault();
        toggler.focus();
        return;
      }

      const nextIndex = currentIndex + 1 > lastIndex ? 0 : currentIndex + 1;
      const prevIndex = currentIndex ? currentIndex - 1 : lastIndex;

      const prevCode = opts.horizontal ? KEY_ARROW_LEFT : KEY_ARROW_UP;
      const nextCode = opts.horizontal ? KEY_ARROW_RIGHT : KEY_ARROW_DOWN;

      if (isControl) {
        event.preventDefault();
        event.stopPropagation();
      }

      switch (event.keyCode) {
        case KEY_ENTER:
        case KEY_SPACE:
          focusableElems[currentIndex].click();
          hide({ event, trigger: event.target });
          break;
        case KEY_END:
          focusableElems[lastIndex].focus();
          break;
        case KEY_HOME:
          focusableElems[firstIndex].focus();
          break;
        case prevCode:
          focusableElems[prevIndex].focus();
          break;
        case nextCode:
          focusableElems[nextIndex].focus();
          break;
      }
    }
    destroy(destroyOpts) {
      if (!this.isInit) return;
      const { opts, toggler } = this;
      this.emit(EVENT_BEFORE_DESTROY);
      opts.a11y && removeAttribute(toggler, ARIA_CONTROLS);
      removeClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX]);
      return baseDestroy(this, destroyOpts);
    }

    async toggle(s, params) {
      const { toggler, base, opts, emit, transition, isShown, isAnimating } =
        this;
      const { awaitAnimation, autofocus, a11y } = opts;
      const {
        animated,
        silent,
        trigger,
        event,
        ignoreConditions,
        ignoreAutofocus,
      } = normalizeToggleParameters(params);

      s ??= !isShown;

      if (!ignoreConditions && ((awaitAnimation && isAnimating) || s === isShown))
        return;

      this.isShown = s;

      if (isAnimating && !awaitAnimation) {
        await transition.cancel();
      }

      if (s) {
        opts[MODE] === ABSOLUTE ? toggler.after(base) : body.appendChild(base);
      }

      const eventParams = { event, trigger };

      !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

      a11y && toggler.setAttribute(ARIA_EXPANDED, !!s);

      toggleClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);

      const promise = floatingTransition(this, {
        s,
        animated,
        silent,
        eventParams,
      });

      !s && base.contains(doc.activeElement) && toggler.focus();

      s && !ignoreAutofocus && autofocus && callAutofocus(this);

      awaitPromise(promise, () =>
        emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams),
      );

      animated && awaitAnimation && (await promise);

      return this;
    }
  }

  const DOM_ELEMENTS = [MODAL, BACKDROP, CONTENT];
  const CLASS_PREVENT_SCROLL =
    UI_PREFIX + MODAL + "-" + ACTION_PREVENT + "-" + SCROLL;

  const PROPERTY_ROOT_SCROLLBAR_WIDTH =
    VAR_UI_PREFIX + ROOT + "-scrollbar-" + WIDTH;
  const ARIA_SUFFIX = {
    [ARIA_LABELLEDBY]: TITLE,
    [ARIA_DESCRIBEDBY]: "description",
  };

  const updateBodyScrollbarWidth = () => {
    return doc
      .querySelector(SELECTOR_ROOT)
      .style.setProperty(
        PROPERTY_ROOT_SCROLLBAR_WIDTH,
        window.innerWidth - doc.documentElement.clientWidth + PX,
      );
  };

  class Modal extends ToggleMixin(Base, MODAL) {
    static DefaultGroup = {
      name: "",
      awaitPrevious: true,
      hidePrevious: true,
    };
    static DefaultPreventScroll = {
      class: CLASS_PREVENT_SCROLL,
    };
    static DefaultAutofocus = {
      elem: DEFAULT_AUTOFOCUS,
      required: true,
    };
    static Default = {
      ...DEFAULT_OPTIONS,
      eventPrefix: getEventsPrefix(MODAL),
      escapeHide: true,
      backdropHide: true,
      hashNavigation: false,
      returnFocus: true,
      hideable: true,
      dismiss: true,
      preventScroll: true,
      cancel: SELECTOR_DATA_CANCEL,
      confirm: SELECTOR_DATA_CONFIRM,
      title: getDataSelector(MODAL, ARIA_SUFFIX[ARIA_LABELLEDBY]),
      description: getDataSelector(MODAL, ARIA_SUFFIX[ARIA_DESCRIBEDBY]),
      group: "",
      autofocus: true,
      focusTrap: true,
      awaitAnimation: false,
      [CONTENT]: getDataSelector(MODAL, CONTENT),
      [BACKDROP]: getDataSelector(MODAL, BACKDROP),
      [TOGGLER]: true,
      [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [MODAL + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    };

    constructor(elem, opts) {
      super(elem, opts);
    }
    get transition() {
      return this.transitions[MODAL];
    }
    _update() {
      updateModule(this, OPTION_GROUP, NAME);
      updateModule(this, OPTION_PREVENT_SCROLL);
      updateModule(this, AUTOFOCUS);

      this.transitions ||= {};

      const {
        modal,
        transitions,
        opts: {
          teleport: teleportOpts,
          transitions: transitionsOpts,
          toggler,
          a11y,
          escapeHide,
        },
        isDialog,
        _fromHTML,
        teleport,
        id,
        on,
        off,
      } = this;

      this.teleport = Teleport.createOrUpdate(
        teleport,
        modal,
        teleportOpts == null && (!isDialog || _fromHTML) ? body : teleportOpts,
        {
          keepPlace: false,
        },
      )?.move(this);

      for (const elemName of DOM_ELEMENTS) {
        if (this[elemName]) {
          transitions[elemName] = Transition.createOrUpdate(
            transitions[elemName],
            this[elemName],
            transitionsOpts?.[elemName],
            { keepPlace: elemName === CONTENT },
          );
        }
      }

      this._togglers = toggler === true ? getDefaultToggleSelector(id) : toggler;

      if (a11y && !isDialog) {
        setAttribute(modal, TABINDEX, -1);
        setAttribute(modal, ROLE, DIALOG);
      }

      if (escapeHide) {
        on(modal, CANCEL + UI_EVENT_PREFIX, (e) => e.preventDefault());
      } else {
        off(modal, CANCEL + UI_EVENT_PREFIX);
      }

      return this;
    }
    init() {
      const { opts, isInit, modal, on, emit, hide, toggle } = this;
      const optsBackdrop = opts[BACKDROP];

      if (isInit) return;

      emit(EVENT_BEFORE_INIT);

      let backdrop;
      if (optsBackdrop) {
        if (isFunction(optsBackdrop)) {
          backdrop = optsBackdrop(this);
        }
        if (isString(optsBackdrop)) {
          backdrop = (optsBackdrop[0] === "#" ? doc : modal).querySelector(
            optsBackdrop,
          );
        }
      }
      this[BACKDROP] = backdrop;

      this[CONTENT] = getOptionElem(this, opts[CONTENT], modal);

      this._update();
      this.updateAriaTargets();
      addDismiss(this);

      on(
        modal,
        [
          EVENT_CLICK,
          opts.backdropHide &&
            (opts.backdropHide?.rightClick ?? true) &&
            EVENT_RIGHT_CLICK,
        ],
        (event) => {
          if (event.type === EVENT_CLICK) {
            [CANCEL, CONFIRM].forEach((name) => {
              if (opts[name]) {
                const trigger = closest(event.target, opts[name]);
                trigger && emit(name, { event, trigger });
              }
            });
          }
          if (
            this.opts.backdropHide &&
            !this[CONTENT].contains(event.target) &&
            !this._mousedownTarget
          ) {
            hide({ event });
            emit(CANCEL, { event });
          }
          this._mousedownTarget = null;
        },
      );

      on(body, EVENT_CLICK + UI_EVENT_PREFIX, (event) => {
        const togglers = this._togglers;
        const trigger = isString(togglers)
          ? event.target.closest(togglers)
          : closest(event.target, togglers);
        if (trigger) {
          event.preventDefault();
          toggle(null, { trigger, event });
        }
      });

      return callInitShow(this);
    }
    destroy(destroyOpts) {
      if (!this.isInit) return;

      removeClass(this._togglers, this.opts[TOGGLER + CLASS_ACTIVE]);
      this.opts.a11y &&
        removeAttribute(this.base, [
          TABINDEX,
          ROLE,
          ARIA_LABELLEDBY,
          ARIA_DESCRIBEDBY,
        ]);
      baseDestroy(this, destroyOpts);
      return this;
    }
    cancelAnimations() {
      return Promise.allSettled(
        DOM_ELEMENTS.map((elemName) => this.transitions[elemName]?.cancel()),
      );
    }
    updateAriaTargets() {
      const { base, opts } = this;
      for (const name of [ARIA_LABELLEDBY, ARIA_DESCRIBEDBY]) {
        const suffix = ARIA_SUFFIX[name];
        let elem = opts[suffix];
        if (isString(elem)) {
          elem = getOptionElem(this, elem, base);
        }
        if (!isElement(elem)) {
          elem = null;
        }
        this[suffix] = elem;
        if (!elem) return;
        const id = elem
          ? (elem.id ||= uuidGenerator(MODAL + "-" + suffix + "-"))
          : elem;
        setAttribute(base, name, id);
      }
      return this;
    }
    _preventScroll(s) {
      const hasPreventScrollModals = Modal.shownModals.filter(
        ({ opts }) => opts.preventScroll,
      ).length;
      if ((s && hasPreventScrollModals) || (!s && !hasPreventScrollModals)) {
        toggleClass(body, this.opts.preventScroll.class, s);
      }
    }
    async toggle(s, params) {
      const {
        opts,
        isOpen,
        emit,
        on,
        off,
        isAnimating,
        transitions,
        isDialog,
        modal,
        content,
        backdrop,
      } = this;

      let optReturnFocusAwait =
        opts.returnFocus && (opts.returnFocus?.await ?? opts.group.awaitPrevious);

      const {
        animated,
        silent,
        trigger,
        event,
        ignoreAutofocus,
        ignoreConditions,
      } = normalizeToggleParameters(params);

      s = !!(s ?? !isOpen);

      if (
        !ignoreConditions &&
        ((opts.awaitAnimation && isAnimating) || s === isOpen)
      )
        return;

      if (isAnimating && !opts.awaitAnimation) {
        await this.cancelAnimations();
      }

      const eventParams = { trigger, event };

      !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

      if (
        !s &&
        !(isFunction(opts.hideable)
          ? await opts.hideable(this, eventParams)
          : opts.hideable)
      ) {
        return emit(EVENT_HIDE_PREVENTED);
      }

      this.isOpen = s;

      const backdropIsOpen = Modal.shownModals.find(
        (modal) => modal !== this && modal[BACKDROP] === backdrop,
      );

      const shownGroupModals = this.shownGroupModals;
      if (s) {
        if (shownGroupModals.length > 1) {
          const promises = Promise.allSettled(
            shownGroupModals
              .filter((m) => m !== this)
              .map((modal) => modal.hide() && modal.transitionPromise),
          );
          if (opts.group.awaitPrevious) {
            await promises;
          }
        }
      } else if (!s && !shownGroupModals.length) {
        optReturnFocusAwait = false;
      }

      toggleClass(
        getElements(this._togglers),
        opts[TOGGLER + CLASS_ACTIVE_SUFFIX],
        s,
      );

      toggleClass(modal, opts[MODAL + CLASS_ACTIVE_SUFFIX], s);

      if (s) {
        transitions[MODAL].toggleRemove(true);
        transitions[CONTENT].toggleRemove(true);
        if (isDialog) {
          if (opts.focusTrap) {
            modal.showModal();
          } else {
            modal.show();
          }
        }
        if (opts.returnFocus) {
          this.returnFocusElem = doc.activeElement;
        }
      }

      !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

      for (const elemName of [MODAL, BACKDROP, CONTENT]) {
        if (elemName === BACKDROP && backdropIsOpen) {
          continue;
        }
        const transitionOpts = { allowRemove: elemName !== MODAL };

        if (elemName !== MODAL) {
          transitions[elemName]?.run(s, animated, transitionOpts);
        }
      }

      this._preventScroll(s);

      if (!s && !optReturnFocusAwait) {
        this.returnFocus();
      }

      opts.escapeHide && addEscapeHide(this, s);

      if (s) {
        !ignoreAutofocus && opts.autofocus && callAutofocus(this);

        on(content, EVENT_MOUSEDOWN + UI_EVENT_PREFIX, (e) => {
          this._mousedownTarget = e.target;
        });
      } else {
        this._mousedownTarget = null;

        off(content, EVENT_MOUSEDOWN + UI_EVENT_PREFIX);

        if (isDialog && !optReturnFocusAwait) {
          modal.close();
        }
      }

      const promise = this.transitionPromise;

      awaitPromise(promise, () => {
        emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);

        if (!s && optReturnFocusAwait) {
          if (isDialog) {
            modal.close();
          }
          this.returnFocus();
        }
        if (!s) {
          transitions[MODAL].toggleRemove(false);
          if (transitions[MODAL].opts[HIDE_MODE] === ACTION_DESTROY) {
            this.destroy({ remove: true });
          }
        }
      });

      animated && opts.awaitAnimation && (await promise);

      return this;
    }

    returnFocus() {
      if (
        !this.isDialog &&
        this.opts.returnFocus &&
        this.modal.contains(doc.activeElement)
      ) {
        focus(this.returnFocusElem);
      }
    }

    get isDialog() {
      return this[MODAL].tagName === "DIALOG";
    }
    get isAnimating() {
      return DOM_ELEMENTS.some(
        (elemName) => this.transitions[elemName]?.isAnimating,
      );
    }

    get transitionPromise() {
      return Promise.allSettled(
        Object.values(this.transitions).flatMap(({ promises }) => promises),
      );
    }

    get groupModals() {
      return arrayFrom(this.instances.values()).filter(
        ({ opts }) => opts.group?.name === this.opts.group?.name,
      );
    }
    static get shownModals() {
      return arrayFrom(this.instances.values()).filter(({ isOpen }) => isOpen);
    }
    get shownGroupModals() {
      return this.groupModals.filter(({ isOpen, opts }) => opts.group && isOpen);
    }
    static updateBodyScrollbarWidth() {
      updateBodyScrollbarWidth();
    }
  }

  const TABLIST = "tablist";
  const TAB = "tab";
  const TABS = "tabs";
  const TABPANEL = "tabpanel";
  const ITEM = "item";
  const ACCORDION = "accordion";

  const ELEMS = [ITEM, TAB, TABPANEL];
  const OPTION_TAB_ROLE = TAB + ROLE_SUFFIX;
  const OPTION_TABPANEL_ROLE = TABPANEL + ROLE_SUFFIX;
  const OPTION_TABPANEL_TABINDEX = TABPANEL + upperFirst(TABINDEX);
  const OPTION_ARIA_ORIENTRATION = kebabToCamel(ARIA_ORIENTATION);
  const OPTION_STATE_ATTRIBUTE = "stateAttribute";

  const TABLIST_SECONDARY_METHODS = ["getTab", "isTab", "initTab", "initTabs"];

  const A11Y_DEFAULTS = {
    [ACCORDION]: {
      [ROLE]: null,
      [OPTION_TAB_ROLE]: BUTTON,
      [OPTION_TABPANEL_ROLE]: "region",
      [OPTION_ARIA_ORIENTRATION]: true,
      [OPTION_STATE_ATTRIBUTE]: ARIA_EXPANDED,
      [TABINDEX]: false,
      [OPTION_TABPANEL_TABINDEX]: false,
    },
    [TABS]: {
      [ROLE]: TABLIST,
      [OPTION_TAB_ROLE]: TAB,
      [OPTION_TABPANEL_ROLE]: TABPANEL,
      [OPTION_ARIA_ORIENTRATION]: true,
      [OPTION_STATE_ATTRIBUTE]: ARIA_SELECTED,
      [TABINDEX]: true,
      [OPTION_TABPANEL_TABINDEX]: true,
    },
  };

  class Tablist extends Base {
    static DefaultA11y = { ...A11Y_DEFAULTS[ACCORDION] };
    static Default = {
      ...DEFAULT_OPTIONS,
      eventPrefix: getEventsPrefix(TABLIST),
      siblings: true,
      alwaysExpanded: false,
      multiExpand: false,
      awaitAnimation: false,
      awaitPrevious: false,
      keyboard: true,
      arrowActivation: false,
      hashNavigation: true,
      rtl: false,
      focusFilter: null,
      horizontal: false,
      dismiss: false,
      [TAB]: getDataSelector(TABLIST, TAB),
      [TABPANEL]: getDataSelector(TABLIST, TABPANEL),
      [ITEM]: getDataSelector(TABLIST, ITEM),
      [TAB + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [ITEM + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [TABPANEL + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    };
    static _data = {};
    static instances = new Map();
    static get NAME() {
      return TABLIST;
    }
    constructor(elem, opts) {
      super(elem, opts);
    }
    _update() {
      const { a11y } = updateModule(this, A11Y, false, A11Y_DEFAULTS);
      const { tablist, tabs, lastShownTab, opts } = this;

      if (a11y) {
        setAttribute(tablist, ROLE, a11y[ROLE]);
        a11y[OPTION_ARIA_ORIENTRATION] &&
          setAttribute(
            tablist,
            ARIA_ORIENTATION,
            opts[HORIZONTAL] ? HORIZONTAL : VERTICAL,
          );
      }

      const shown = lastShownTab?.index ?? opts.shown;

      const tabWithState = tabs.map((tabObj, i) => {
        const { tab, tabpanel, teleport, transition } = tabObj;

        if (a11y) {
          removeAttribute(tab, [ARIA_SELECTED, ARIA_EXPANDED]);
          setAttribute(tab, ARIA_CONTROLS, tabpanel.id);
          setAttribute(tab, ROLE, a11y[OPTION_TAB_ROLE]);
          setAttribute(tabpanel, ROLE, a11y[OPTION_TABPANEL_ROLE]);
          setAttribute(tabpanel, ARIA_LABELLEDBY, tab.id);
        }

        tabObj.teleport = Teleport.createOrUpdate(
          teleport,
          tabpanel,
          opts.teleport,
        )?.move(this, tabObj);

        let isShown;
        if (isFunction(shown)) {
          isShown = shown(tabObj);
        } else if (isArray(shown)) {
          isShown = shown.some((val) => val === i || val === tabpanel.id);
        } else if (shown !== null) {
          isShown = tabpanel.id === shown || i === shown;
        } else {
          isShown = transition.isShown;
        }

        return [isShown, tabObj];
      });
      const hasSelected = tabWithState.find(([isShown]) => isShown);
      if (opts.alwaysExpanded && !hasSelected) {
        tabWithState[0][0] = true;
      }
      tabWithState.forEach(([isShown, tab]) => {
        tab.transition.updateConfig(opts.transition);
        tab.toggle(isShown, {
          animated: opts.appear ?? tab.tabpanel.hasAttribute(DATA_APPEAR),
          silent: !isShown,
        });
      });

      return this;
    }
    init() {
      const { id, instances, isInit, emit } = this;
      if (isInit) return;

      TABLIST_SECONDARY_METHODS.forEach(
        (name) => (this[name] = this[name].bind(this)),
      );

      emit(EVENT_BEFORE_INIT);

      this.tabs = [];
      this.initTabs();

      instances.set(id, this);

      this._updateTabIndex();

      this._update();

      this.isInit = true;

      return emit(EVENT_INIT);
    }

    destroy(deleteInstance = false, cleanStyles = true) {
      const {
        tablist,
        tabs,
        uuid,
        opts: { a11y },
        isInit,
        off,
        instances,
        id,
        emit,
      } = this;

      if (!isInit) return;

      emit(EVENT_BEFORE_DESTROY);

      off(tabs);

      if (a11y) {
        removeAttribute(tablist, [
          a11y[ROLE] && ROLE,
          a11y[OPTION_ARIA_ORIENTRATION] && ARIA_ORIENTATION,
        ]);
      }
      tablist.id.includes(uuid) && tablist.removeAttribute(ID);

      tabs.forEach((tab) => tab.destroy(cleanStyles));

      this.isInit = false;

      if (deleteInstance) {
        instances.delete(id);
      }

      emit(EVENT_DESTROY);

      return this;
    }

    initTabs() {
      return getOptionElems(this, this.opts[TAB], this.tablist)
        .map((tab) => {
          for (const parent of parents(tab, null, this.tablist)) {
            if (this.getTab(parent)) return;
          }
          return this.initTab(tab);
        })
        .filter(Boolean);
    }
    initTab(tab) {
      if (this.getTab(tab)) return;

      const { tabs, tablist, opts, shownTabs, on, off } = this;
      const index = tabs.length;

      const item = isString(opts[ITEM])
        ? tab.closest(opts[ITEM])
        : callOrReturn(opts[ITEM], { tablist, tab, index });

      const tabpanelId = tab.getAttribute(DATA_UI_PREFIX + TABLIST + "-" + TAB);
      let tabpanel = tabpanelId && doc.getElementById(tabpanelId);

      if (!tabpanel && isFunction(opts[TABPANEL])) {
        tabpanel = opts[TABPANEL]({ tablist, tab, index });
      }
      if (!tabpanel && opts.siblings) {
        tabpanel = next(tab, opts[TABPANEL]);
      }

      if (!tabpanel) return;

      const uuid = uuidGenerator();
      const id = (tabpanel.id ||= TABPANEL + "-" + uuid);
      tab.id ||= TAB + "-" + uuid;

      let isShown;
      if (shownTabs.length && !opts.multiExpand) {
        isShown = false;
      }
      if (opts.hashNavigation && checkHash(id)) {
        isShown = true;
      }

      on(tab, EVENT_FOCUS, (e) => this._onTabFocus(e));
      on(tab, EVENT_KEYDOWN, (e) => this._onTabKeydown(e));
      on(tab, EVENT_CLICK, (event) => {
        event.preventDefault();
        this.toggle(event.currentTarget, null, { event, trigger: tab });
      });

      const destroy = ({ clean = true, remove = false }) => {
        const opts = this.opts;
        const a11y = opts.a11y;
        if (a11y) {
          removeAttribute(tab, [
            ROLE,
            a11y[TABINDEX] && TABINDEX,
            ARIA_CONTROLS,
            a11y[OPTION_STATE_ATTRIBUTE],
          ]);
          removeAttribute(tabpanel, [
            ROLE,
            a11y[OPTION_TABPANEL_TABINDEX] && TABINDEX,
            ARIA_LABELLEDBY,
            a11y[OPTION_ARIA_HIDDEN] && ARIA_HIDDEN,
            HIDDEN,
            INERT,
          ]);
        }

        off(elems);
        this.tabs = without(this.tabs, tabInstance);
        if (clean) {
          ELEMS.forEach((name) =>
            removeClass(tabInstance[name], opts[name + CLASS_ACTIVE_SUFFIX]),
          );
          tabInstance.transition?.destroy();
          tabInstance.teleport?.destroy();
        }
        tabpanel.id.includes(uuid) && tabpanel.removeAttribute(ID);
        tab.id.includes(uuid) && tab.removeAttribute(ID);

        if (remove) {
          elems.forEach((elem) => elem && elem.remove());
        }
      };

      const toggleDisabled = (s = null) => {
        const disabled = tab.toggleAttribute(DISABLED, s);

        disabled && tabInstance.hide(false);

        if (this.opts.alwaysExpanded) {
          const shownTabs = this.shownTabs;
          if (
            !shownTabs.length ||
            (shownTabs.length === 1 && shownTabs[0].isDisabled)
          ) {
            this.show(this.firstActiveTabIndex, false);
          }
        }

        return !disabled;
      };

      const transition = new Transition(tabpanel, opts.transition);

      const elems = [tab, item, tabpanel];
      const tabInstance = {
        id,
        uuid,
        tab,
        item,
        tabpanel,
        elems,
        index,
        transition,
        destroy: destroy.bind(this),
        toggleDisabled: toggleDisabled.bind(this),
        isShown,
        get isDisabled() {
          return tab.hasAttribute(DISABLED);
        },
        get initialPlaceNode() {
          return (
            tabInstance.teleport?.placeholder ??
            tabInstance.transition?.placeholder ??
            tabpanel
          );
        },
      };

      [ACTION_HIDE, ACTION_SHOW, ACTION_TOGGLE].forEach(
        (action) => (tabInstance[action] = this[action].bind(this, tabInstance)),
      );
      tabInstance.is = this.isTab.bind(this, tabInstance);

      addDismiss(this, tabpanel, tabInstance.hide);

      tabs.push(tabInstance);
      return tabInstance;
    }
    isTab(tab, value) {
      let result = false;
      if (tab === value) {
        result = true;
      } else if (isElement(value)) {
        result = tab.elems.includes(value);
      } else if (isString(value)) {
        result = tab.elems.some((elem) => elem.matches(value));
      } else if (isNumber(value)) {
        result = tab.index === value;
      }
      return result;
    }
    getTab(value) {
      return this.tabs.find((tab) => tab.is(value));
    }
    _onTabFocus({ currentTarget }) {
      const tabInstance = this.getTab(currentTarget);
      if (!tabInstance || !this.focusFilter(tabInstance)) return;

      this.opts.arrowActivation && !tabInstance.isShown && tabInstance.show();

      this.currentTabIndex = tabInstance.index;
    }
    _onTabKeydown(event) {
      const tabInstance = this.getTab(event.currentTarget);
      const currentIndex = this.tabs.indexOf(tabInstance);
      const { keyboard, rtl, horizontal } = this.opts;
      const { keyCode } = event;

      if (
        [KEY_ENTER, KEY_SPACE].includes(keyCode) &&
        !/BUTTON|A/.test(tabInstance.tab.nodeName)
      )
        return tabInstance.toggle(null, { event, trigger: event.target });
      if (KEY_END > keyCode || KEY_ARROW_DOWN < keyCode || !keyboard) return;

      event.preventDefault();

      const firstIndex = this.firstActiveTabIndex;
      const lastIndex = this.lastActiveTabIndex;
      const nextIndex = currentIndex + 1;
      const prevIndex = currentIndex ? currentIndex - 1 : lastIndex;

      const prevCode = horizontal ? KEY_ARROW_LEFT : KEY_ARROW_UP;
      const nextCode = horizontal ? KEY_ARROW_RIGHT : KEY_ARROW_DOWN;

      let index;
      if (keyCode === KEY_END) {
        index = rtl ? firstIndex : lastIndex;
      } else if (keyCode === KEY_HOME) {
        index = rtl ? lastIndex : firstIndex;
      } else if (keyCode === prevCode) {
        index = rtl ? nextIndex : prevIndex;
      } else if (keyCode === nextCode) {
        index = rtl ? prevIndex : nextIndex;
      }
      index != null && this._switchTab(index);
    }
    _switchTab(index) {
      const tabs = this.tabs;
      if (tabs[index] && !this.focusFilter(tabs[index])) {
        this._switchTab(index > this.currentTabIndex ? index + 1 : index - 1);
        return;
      }
      this.currentTabIndex =
        index < this.firstActiveTabIndex
          ? this.lastActiveTabIndex
          : index >= tabs.length
          ? this.firstActiveTabIndex
          : index;

      focus(tabs[this.currentTabIndex].tab);
    }
    _updateTabIndex(activeIndex) {
      const { keyboard, a11y } = this.opts;
      if (!keyboard || !a11y) return;
      activeIndex ??= this.shownTabs[0]?.index ?? this.firstActiveTabIndex;
      a11y &&
        this.tabs.forEach(({ tab, tabpanel }, i) =>
          setAttribute(
            [a11y[TABINDEX] && tab, a11y[OPTION_TABPANEL_TABINDEX] && tabpanel],
            TABINDEX,
            i === activeIndex ? 0 : -1,
          ),
        );
    }
    focusFilter(tab) {
      return (
        !isUnfocusable(tab.tab) &&
        (isFunction(this.opts.focusFilter) ? this.opts.focusFilter(tab) : true)
      );
    }
    get shownTabs() {
      return this.tabs.filter(({ isShown }) => isShown);
    }
    get firstActiveTabIndex() {
      return this.tabs.find((tab) => this.focusFilter(tab))?.index;
    }
    get lastActiveTabIndex() {
      return this.tabs.findLast((tab) => this.focusFilter(tab))?.index;
    }

    async toggle(elem, s, params) {
      const { animated, silent, event, trigger } =
        normalizeToggleParameters(params);
      const tabInstance = this.getTab(elem);

      if (!tabInstance) return;

      const { opts, shownTabs, emit } = this;
      const { a11y, multiExpand, awaitAnimation } = opts;
      const { tab, isShown, transition, index } = tabInstance;

      s = !!(s ?? !isShown);

      s && this._updateTabIndex(index);

      if (
        s === isShown ||
        (awaitAnimation &&
          transition.isAnimating &&
          ((shownTabs.length <= 1 && !multiExpand) || multiExpand)) ||
        (isShown && opts.alwaysExpanded && !s && shownTabs.length < 2) ||
        (s && !this.focusFilter(tabInstance))
      )
        return;

      if (transition.isAnimating && !awaitAnimation) {
        await transition.cancel();
      }

      const eventParams = { event, trigger };

      !silent &&
        emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, tabInstance, eventParams);

      tabInstance.isShown = s;

      if (!multiExpand && s) {
        for (const shownTab of shownTabs) {
          if (tabInstance !== shownTab && shownTab.isShown) {
            shownTab.hide(animated);
            if (opts.awaitPrevious) await shownTab.transition.getAwaitPromise();
          }
        }
      }

      if (s && !tabInstance.isShown) return;

      ELEMS.forEach((elemName) =>
        toggleClass(
          tabInstance[elemName],
          opts[elemName + CLASS_ACTIVE_SUFFIX],
          s,
        ),
      );

      if (a11y) {
        a11y[OPTION_STATE_ATTRIBUTE] &&
          setAttribute(tab, a11y[OPTION_STATE_ATTRIBUTE], s);
      }

      const promise = transition.run(s, animated, {
        [s ? EVENT_SHOW : EVENT_HIDE]: () =>
          !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, tabInstance, eventParams),
        [EVENT_DESTROY]: () =>
          tabInstance.destroy({ remove: true, destroyTransition: false }),
      });

      if (s) {
        this.lastShownTab = tabInstance;
        this.currentTabIndex ??= index;
      }

      awaitPromise(promise, () =>
        emit(s ? EVENT_SHOWN : EVENT_HIDDEN, tabInstance, eventParams),
      );

      animated && opts.awaitAnimation && (await promise);

      return tabInstance;
    }
    show(elem, opts) {
      return this.toggle(elem, true, opts);
    }
    hide(elem, opts) {
      return this.toggle(elem, false, opts);
    }
    static show(elem, opts) {
      return this.toggle(elem, true, opts);
    }
    static hide(elem, opts) {
      return this.toggle(elem, false, opts);
    }
    static toggle(elem, s, params) {
      for (const tablist of this.instances.values()) {
        if (tablist.getTab(elem)) {
          tablist.toggle(elem, s, params);
          break;
        }
      }
    }
  }

  Tablist.data(UI_PREFIX + TABS, {
    alwaysExpanded: true,
    horizontal: true,
    arrowActivation: true,
    a11y: TABS,
  });

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

  const TOAST = "toast";

  const positions = {};
  const wrappers = new Map();
  const _containers = {};
  class Toast extends ToggleMixin(Base, TOAST) {
    static _templates = {};

    static Default = {
      ...DEFAULT_OPTIONS,
      eventPrefix: getEventsPrefix(TOAST),
      root: null,
      container: "",
      template: "",
      appear: true,
      dismiss: true,
      limit: false,
      limitAnimateEnter: true,
      limitAnimateLeave: true,
      autohide: false,
    };
    constructor(elem, opts) {
      if (isObject(elem)) {
        opts = elem;
        elem = null;
      }
      super(elem, opts);
    }
    _update() {
      const { opts, base, autohide, hide } = this;
      if (!opts.root && inDOM(base)) {
        this.root = base.parentElement;
      } else {
        this.root = opts.root ? getOptionElem(this, opts.root) : body;
      }
      this.transition = new Transition(base, opts.transition, {
        [HIDE_MODE]: ACTION_DESTROY,
      });
      this.autohide = Autoaction.createOrUpdate(
        autohide,
        base,
        hide,
        opts.autohide,
      );

      return this;
    }
    destroy(opts) {
      if (!this.isInit) return;
      baseDestroy(this, { remove: true, ...opts });
      return this;
    }
    init() {
      if (this.isInit) return;

      this._update();

      addDismiss(this);

      return callInitShow(this);
    }
    async toggle(s, params) {
      const {
        transition,
        opts: {
          limit,
          limitAnimateLeave,
          limitAnimateEnter,
          position,
          container,
        },
        autohide,
        base,
        root,
        instances,
        constructor,
        emit,
        destroy,
      } = this;
      const { animated, silent, event, trigger } =
        normalizeToggleParameters(params);

      if (animated && transition.isAnimating) return;

      s ??= !transition.isShown;

      let preventAnimation;

      if (s) {
        if (limit) {
          const nots = arrayFrom(instances.values()).filter(
            (instance) =>
              instance !== this &&
              instance.opts.position === position &&
              instance.root === root,
          );
          for (let i = 0; i < nots.length; i++) {
            if (i >= limit - 1) {
              nots[i - (limit - 1)]?.hide(limitAnimateLeave);
              if (!limitAnimateEnter) {
                preventAnimation = true;
              }
            }
          }
        }
        if (root) {
          let to = root;
          if (position) {
            const wrapper = (to = constructor.getWrapper({
              position,
              root,
              container,
            }));
            if (wrapper && wrapper.parentElement !== root) {
              root.append(wrapper);
            }
          }
          to.append(base);
        }
      }

      const eventParams = { event, trigger };

      !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

      autohide && autohide.toggleInterections(s);

      const promise = transition.run(s, animated && !preventAnimation, {
        [s ? EVENT_SHOW : EVENT_HIDE]: () =>
          !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams),
        [EVENT_DESTROY]: () =>
          destroy({ remove: true, destroyTransition: false }),
      });

      awaitPromise(promise, () =>
        emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams),
      );

      animated && (await promise);

      const rootWrappers = wrappers.get(root);
      const wrapper =
        rootWrappers &&
        [...rootWrappers].find(
          (w) => w.position === position && w.container === container,
        )?.wrapper;

      if (!s && wrapper && !wrapper.children.length) {
        if (rootWrappers) {
          const w = [...rootWrappers].find((w) => w.wrapper === wrapper);
          w && rootWrappers.delete(w);
        }
        wrapper.remove();
      }

      return this;
    }

    static getWrapper({ position, root = body, container = "" }) {
      let rootWrappers = wrappers.get(root);
      if (!rootWrappers) {
        rootWrappers = new Set();
        wrappers.set(root, rootWrappers);
      } else {
        const wrapper = [...rootWrappers].find(
          (w) => w.position === position && w.container === container,
        );
        if (wrapper) return wrapper.wrapper;
      }

      const containerParams = { name: container, position };
      const wrapper = fragment(
        isString(container)
          ? callOrReturn(
              _containers[container] ?? _containers[""],
              containerParams,
            )
          : container(containerParams),
      );

      rootWrappers.add({ wrapper, container, position, root });
      return wrapper;
    }
    static addPosition(position, container = "") {
      positions[container] ||= {};
      if (isArray(position)) {
        position.forEach((p) => this.addPosition(p, container));
      } else if (isObject(position)) {
        positions[container][position.name] = position;
      }
    }
    static template(name, opts) {
      if (!opts) {
        opts = name;
        name = "";
      }
      if (!opts) return this._templates[name];
      this._templates[name] = opts;
      return this;
    }
    static container(name, opts) {
      if (!opts) {
        opts = name;
        name = "";
      }
      if (!opts) return _containers[name];
      _containers[name] = opts;
      return this;
    }
  }

  const UI_TOOLTIP = UI_PREFIX + TOOLTIP;

  class Tooltip extends ToggleMixin(Base, TOOLTIP) {
    static Default = {
      ...DEFAULT_OPTIONS,
      ...DEFAULT_FLOATING_OPTIONS,
      eventPrefix: getEventsPrefix(TOOLTIP),
      placement: TOP,
      template: (content) =>
        `<div class="${UI_TOOLTIP}"><div class="${UI_TOOLTIP}-arrow" data-${UI_TOOLTIP}-arrow></div><div class="${UI_TOOLTIP}-content">${content}</div></div>`,
      interactive: false,
      removeTitle: true,
      tooltipClass: "",
      [ANCHOR + CLASS_ACTIVE_SUFFIX]: getClassActive(TOOLTIP),
      trigger: HOVER + " " + FOCUS,
      content: null,
    };

    static get BASE_NODE_NAME() {
      return ANCHOR;
    }
    constructor(elem, opts) {
      super(elem, opts);
    }
    _update() {
      const { tooltip, opts, transition } = this;

      this.transition = Transition.createOrUpdate(
        transition,
        tooltip,
        opts.transition,
        { [HIDE_MODE]: ACTION_REMOVE, keepPlace: false },
      );

      opts[MODE] =
        this[ANCHOR].getAttribute(DATA_UI_PREFIX + TOOLTIP + "-" + MODE) ??
        opts[MODE];

      opts.a11y && setAttribute(tooltip, TOOLTIP);
    }
    destroy(destroyOpts) {
      const { isInit, anchor, tooltip, id, _cache, emit, opts } = this;
      if (!isInit) return;
      emit(EVENT_BEFORE_DESTROY);
      if (opts.a11y) {
        removeAttribute(tooltip, TOOLTIP);
        setAttribute(anchor, ARIA_DESCRIBEDBY, (val) =>
          val === id + "-" + TARGET ? _cache[OPTION_ARIA_DESCRIBEDBY] : val,
        );
      }

      if (_cache[TITLE]) {
        anchor[TITLE] = _cache[TITLE];
      }
      return baseDestroy(this, destroyOpts);
    }
    init() {
      const { opts, anchor, id, isInit, emit } = this;

      if (isInit) return;

      emit(EVENT_BEFORE_INIT);

      this._cache = { [TITLE]: anchor[TITLE] };

      const target = (this.tooltip = getElement(
        opts.template(
          opts[CONTENT] ??
            anchor.getAttribute(DATA_UI_PREFIX + TOOLTIP + "-" + CONTENT) ??
            anchor[TITLE],
          this,
        ),
      ));
      target.id ||= id + "-" + TARGET;

      anchor.removeAttribute(TITLE);
      toggleClass(
        target,
        anchor.getAttribute(DATA_UI_PREFIX + TOOLTIP + "-" + CLASS) ??
          opts.tooltipClass,
        true,
      );

      this._update();

      toggleOnInterection({ anchor, target, instance: this });

      addDismiss(this, target);

      return callInitShow(this, target);
    }

    async toggle(s, params) {
      const {
        transition,
        anchor,
        tooltip,
        id,
        opts,
        emit,
        _cache,
        isShown,
        isAnimating,
      } = this;
      const awaitAnimation = opts.awaitAnimation;
      const { animated, trigger, silent, event, ignoreConditions } =
        normalizeToggleParameters(params);

      s ??= !isShown;

      if (
        (!ignoreConditions &&
          ((awaitAnimation && isAnimating) || s === isShown)) ||
        (!s && !inDOM(tooltip))
      )
        return;

      this.isShown = s;

      if (isAnimating && !awaitAnimation) {
        await transition.cancel();
      }

      const eventParams = { event, trigger };

      !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

      if (opts.a11y) {
        setAttribute(
          anchor,
          ARIA_DESCRIBEDBY,
          s
            ? (value) => {
                value && (_cache[OPTION_ARIA_DESCRIBEDBY] = value);
                return id + "-" + TARGET;
              }
            : _cache[OPTION_ARIA_DESCRIBEDBY] ?? null,
        );
      }

      toggleClass(anchor, opts[ANCHOR + CLASS_ACTIVE_SUFFIX], s);

      if (s) {
        opts.mode === ABSOLUTE
          ? anchor.after(tooltip)
          : body.appendChild(tooltip);
      }

      const promise = floatingTransition(this, {
        s,
        animated,
        silent,
        eventParams,
      });

      awaitPromise(promise, () =>
        emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams),
      );

      animated && awaitAnimation && (await promise);

      return this;
    }
  }

  // modes POPOVER, DIALOG, FIXED, ABSOLUTE

  class Popover extends ToggleMixin(Base, POPOVER) {
    static DefaultAutofocus = {
      elem: DEFAULT_AUTOFOCUS,
      required: true,
    };
    static Default = {
      ...DEFAULT_OPTIONS,
      ...DEFAULT_FLOATING_OPTIONS,
      focusTrap: true,
      returnFocus: true,
      dismiss: true,
      autofocus: true,
      trigger: CLICK,
      [TOGGLER]: null,
      [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    };

    constructor(elem, opts) {
      super(elem, opts);
    }
    init() {
      if (this.isInit) return;
      this._update();

      const { toggler, popover } = this;

      toggleOnInterection({ anchor: toggler, target: popover, instance: this });
      addDismiss(this, popover);

      return callInitShow(this);
    }
    _update() {
      const { base, opts, transition } = this;

      updateModule(this, AUTOFOCUS);

      this.transition = Transition.createOrUpdate(
        transition,
        base,
        opts.transition,
        { [HIDE_MODE]: ACTION_REMOVE, keepPlace: false },
      );

      this.updateToggler();

      opts[MODE] =
        base.getAttribute(DATA_UI_PREFIX + POPOVER + "-" + MODE) ?? opts[MODE];
    }
    updateToggler() {
      const { opts, id } = this;
      const toggler = (this.toggler = getOptionElem(
        this,
        opts.toggler ?? getDefaultToggleSelector(id),
      ));
      if (!toggler) return;
      opts.a11y && setAttribute(toggler, ARIA_CONTROLS, id);
      return this;
    }
    destroy(destroyOpts) {
      if (!this.isInit) return;
      const { opts, toggler } = this;
      this.emit(EVENT_BEFORE_DESTROY);
      opts.a11y && removeAttribute(toggler, ARIA_CONTROLS);
      removeClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX]);
      return baseDestroy(this, destroyOpts);
    }

    async toggle(s, params) {
      const { transition, isShown, isAnimating, toggler, base, opts, emit } =
        this;
      const { awaitAnimation, a11y, returnFocus, autofocus } = opts;
      const { animated, silent, event, ignoreAutofocus, ignoreConditions } =
        normalizeToggleParameters(params);

      s ??= !isShown;

      if (!ignoreConditions && ((awaitAnimation && isAnimating) || s === isShown))
        return;

      this.isShown = s;

      if (isAnimating && !awaitAnimation) {
        await transition.cancel();
      }

      if (s) {
        opts[MODE] === ABSOLUTE ? toggler.after(base) : body.appendChild(base);
      }

      const eventParams = { event };

      !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

      a11y && toggler.setAttribute(ARIA_EXPANDED, !!s);

      toggleClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);

      const promise = floatingTransition(this, {
        s,
        animated,
        silent,
        eventParams,
      });

      !s && returnFocus && base.contains(doc.activeElement) && focus(toggler);

      s && !ignoreAutofocus && autofocus && callAutofocus(this);

      awaitPromise(promise, () =>
        emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams),
      );

      animated && awaitAnimation && (await promise);

      return this;
    }
  }

  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;
  exports.Modal = Modal;
  exports.Popover = Popover;
  exports.Tablist = Tablist;
  exports.Toast = Toast;
  exports.Tooltip = Tooltip;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=jolty.js.map
