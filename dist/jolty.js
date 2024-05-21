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
  const PRIVATE_PREFIX = "_";
  const DATA_PREFIX = "data-";
  const DATA_UI_PREFIX = DATA_PREFIX + UI_PREFIX;
  const ACTIVE = "active";
  const CLASS_ACTIVE = UI_PREFIX + ACTIVE;

  const DEFAULT = "default";
  const NAME = "name";

  const PX = "px";
  const NONE = "none";

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
  const TRANSITION = "transition";
  const TELEPORT = "teleport";

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
  const AVAILABLE = "available";
  const AVAILABLE_WIDTH = AVAILABLE + "-" + WIDTH;
  const AVAILABLE_HEIGHT = AVAILABLE + "-" + HEIGHT;
  const ANCHOR = "anchor";

  const MODAL = "modal";
  const CONTENT = "content";
  const ITEM = "item";
  const BACKDROP = "backdrop";
  const POPOVER = "popover";
  const TOOLTIP = "tooltip";
  const TOGGLER = "toggler";
  const TRIGGER = "trigger";
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
  const ARROW_WIDTH = ARROW + "-" + WIDTH;
  const ARROW_HEIGHT = ARROW + "-" + HEIGHT;
  const TRUE = "true";
  const FALSE = "false";

  const doc = document;
  const body = doc.body;
  const ROOT_ELEM = doc.documentElement;
  const BODY = "body";

  const ENTER = "enter";
  const LEAVE = "leave";
  BEFORE + upperFirst(ENTER);
  const ENTER_ACTIVE = ENTER + upperFirst(ACTIVE);
  const ENTER_FROM = ENTER + "From";
  const ENTER_TO = ENTER + "To";
  AFTER + upperFirst(ENTER);
  BEFORE + upperFirst(LEAVE);
  const LEAVE_ACTIVE = LEAVE + upperFirst(ACTIVE);
  const LEAVE_FROM = LEAVE + "From";
  const LEAVE_TO = LEAVE + "To";
  AFTER + upperFirst(LEAVE);
  const STATE_MODE = "stateMode";
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
  const AUTO = "auto";
  const FLOATING_DATA_ATTRIBUTE = DATA_UI_PREFIX + FLOATING;
  const POPOVER_API_MODE_MANUAL = "manual";

  const PLACEHOLDER = "placeholder";

  const EVENT_INIT = ACTION_INIT;
  const EVENT_BEFORE_INIT = BEFORE + "Init";
  const EVENT_DESTROY = ACTION_DESTROY;
  const EVENT_BEFORE_DESTROY = BEFORE + "Destroy";
  const EVENT_BEFORE_SHOW = BEFORE + "Show";
  const EVENT_SHOW = SHOW;
  const EVENT_SHOWN = SHOWN;
  const EVENT_BEFORE_HIDE = BEFORE + "Hide";
  const EVENT_HIDE = HIDE;
  const EVENT_HIDDEN = HIDDEN;
  const EVENT_PAUSE = ACTION_PAUSE;
  const EVENT_RESUME = ACTION_RESUME;
  const EVENT_RESET = ACTION_RESET;
  const EVENT_MOUSEENTER = MOUSE + ENTER;
  const EVENT_MOUSELEAVE = MOUSE + LEAVE;
  const EVENT_MOUSEDOWN = MOUSE + DOWN;
  const EVENT_MOUSEOVER = MOUSE + "over";
  const EVENT_MOUSEOUT = MOUSE + OUT;
  const EVENT_CHANGE = "change";
  const EVENT_BREAKPOINT = "breakpoint";
  const EVENT_CLOSE = "close";
  const EVENT_CLICK = CLICK;
  const EVENT_KEYDOWN = KEY + DOWN;
  const EVENT_KEYUP = KEY + UP;
  const EVENT_FOCUS = FOCUS;
  const EVENT_FOCUSIN = FOCUS + IN;
  const EVENT_FOCUSOUT = FOCUS + OUT;
  const EVENT_CONTEXT_MENU_CLICK = "contextmenu";
  const EVENT_VISIBILITY_CHANGE = "visibilitychange";

  const EVENT_HIDE_PREVENTED = "hidePrevented";
  const EVENT_SCROLL = SCROLL;
  const EVENT_RESIZE = "resize";
  const EVENT_BEFORE_MATCH = BEFORE + "match";

  const UNTIL_FOUND = "until-found";
  const MODE_HIDDEN_UNTIL_FOUND = HIDDEN + "-" + UNTIL_FOUND;

  const ARIA = "aria";
  const ARIA_CONTROLS = ARIA + "-controls";
  const ARIA_EXPANDED = ARIA + "Expanded";
  const ARIA_SELECTED = ARIA + "Selected";
  const ARIA_HIDDEN = ARIA + "Hidden";
  const ARIA_LABELLEDBY = ARIA + "-labelledby";
  const ARIA_DESCRIBEDBY = ARIA + "-describedby";
  const ARIA_ORIENTATION = ARIA + "Orientation";
  const ARIA_LIVE = ARIA + "Live";
  const ARIA_ATOMIC = ARIA + "Atomic";

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

  const PREVENT = "prevent";

  const OPTION_PREVENT_SCROLL = PREVENT + "Scroll";
  const OPTION_HASH_NAVIGATION = "hashNavigation";
  const POSITION = "position";
  const OPTION_ARIA_DESCRIBEDBY = kebabToCamel(ARIA_DESCRIBEDBY);
  const OPTION_TOP_LAYER = "topLayer";
  const OPTION_MOVE_TO_ROOT = "moveToRoot";
  const OPTION_LIGHT_DISMISS = "lightDismiss";
  const OPTION_BACK_DISMISS = "backDismiss";

  const OPTION_PREVENT_DISMISS = "preventDismiss";
  const EVENT_DISMISS_PREVENTED = "dismissPrevented";

  const OPTION_AUTODESTROY = AUTO + ACTION_DESTROY;
  const CLASS_ACTIVE_SUFFIX = "ClassActive";
  const ROLE_SUFFIX = "Role";

  const STATUS = "status";
  const ALERT = "alert";
  const REGION = "region";

  const HIDDEN_CLASS = UI_PREFIX + HIDDEN;
  const SHOWN_CLASS = UI_PREFIX + SHOWN;
  const CLASS_SHOWN_MODE = CLASS + "-" + SHOWN;
  const CLASS_HIDDEN_MODE = CLASS + "-" + HIDDEN;

  const EVENT_SUFFIX_LIGHT_DISMISS = "." + OPTION_LIGHT_DISMISS;

  const TOP_LAYER_OPTIONS_NAMES = [
    OPTION_PREVENT_SCROLL,
    OPTION_TOP_LAYER,
    OPTION_MOVE_TO_ROOT,
    OPTION_LIGHT_DISMISS,
    OPTION_BACK_DISMISS,
    OPTION_PREVENT_DISMISS,
    MODAL,
  ];

  const TOP_LAYER_OPTIONS = {
    root: BODY,
    [OPTION_TOP_LAYER]: true,
    [OPTION_MOVE_TO_ROOT]: false,
    [MODAL]: false,
  };

  const DEFAULT_OPTIONS = {
    init: true,
    destroy: false,
    data: "",
    on: null,
    appear: null,
    eventDispatch: true,
    eventBubble: true,
    shown: null,
    a11y: true,
    stateMode: HIDDEN,
    keepPlace: true,
    transition: true,
    awaitAnimation: false,
    dismiss: true,
  };

  const DEFAULT_FLOATING_OPTIONS = {
    awaitAnimation: false,
    placement: BOTTOM,
    offset: 0,
    padding: 0,
    delay: 150,
    boundaryOffset: 0,
    shrink: false,
    flip: true,
    sticky: true,
    focusTrap: "auto",
    shown: false,
    arrow: null,
    [OPTION_LIGHT_DISMISS]: true,
    [OPTION_BACK_DISMISS]: true,
    ...TOP_LAYER_OPTIONS,
  };
  const SELECTOR_DISABLED = `[${DISABLED}]`;
  const SELECTOR_INERT = `[${INERT}]`;
  const SELECTOR_FOCUS_WITHIN = ":focus-within";
  const SELECTOR_HOVER = ":" + HOVER;

  const MIRROR = {
    [TOP]: BOTTOM,
    [BOTTOM]: TOP,
    [LEFT]: RIGHT,
    [RIGHT]: LEFT,
    [START]: END,
    [END]: START,
    [WIDTH]: HEIGHT,
    [HEIGHT]: WIDTH,
    [CENTER]: CENTER,
    x: "y",
    y: "x",
  };

  const CLIP_PATH_PROPERTY = CSS.supports(CLIP_PATH + ":" + NONE)
    ? CLIP_PATH
    : WEBKIT_PREFIX + CLIP_PATH;

  const POPOVER_API_SUPPORTED =
    // eslint-disable-next-line no-prototype-builtins
    HTMLElement.prototype.hasOwnProperty(POPOVER);

  const FOCUSABLE_ELEMENTS_SELECTOR = `:is(:is(a,area)[href],:is(select,textarea,button,input:not([type="hidden"])):not(disabled),details:not(:has(>summary)),iframe,:is(audio,video)[controls],[contenteditable],[tabindex]):not([inert],[inert] *,[tabindex^="-"],[${DATA_UI_PREFIX}focus-guard])`;

  const PRIVATE_OPTION_CANCEL_ON_HIDE = PRIVATE_PREFIX + "cancelOnHide";

  const ARIA_SUFFIX = {
    [ARIA_LABELLEDBY]: TITLE,
    [ARIA_DESCRIBEDBY]: "description",
  };

  const AUTOHIDE = "autohide";

  var isArray = Array.isArray;

  var isElement = (value) => value && !!value.getElementsByClassName;

  var isFunction = (value) => typeof value === "function";

  var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

  var isString = (value) => typeof value === "string";

  var isIterable = (value) => value && !!value[Symbol.iterator] && !isString(value);

  var isNumber = (value) => typeof value === "number";

  var isObject = (value) => value && value.constructor === Object;

  var isDialog = (elem) => elem?.tagName === "DIALOG";

  var isModal = (elem) => elem && elem.matches(":" + MODAL);

  var strToArray = (str = "", separator = " ") =>
    str ? (isArray(str) ? str : str.split(separator)).filter(Boolean) : [];

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

  var addClass = (elem, classes) => toggleClass(elem, classes, true);

  const cache = {};
  var camelToKebab = (str = "") =>
    cache[str] ||
    (cache[str] = str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase());

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

  var arrayFrom = Array.from;

  var is = (elem, selector) =>
    elem === selector
      ? true
      : isString(selector)
      ? elem.matches(selector)
      : isIterable(selector)
      ? arrayFrom(selector).includes(elem)
      : isFunction(selector) && selector(elem);

  var returnArray = (elem) =>
    elem !== undefined ? (isIterable(elem) ? arrayFrom(elem) : [elem]) : [];

  var arrayUnique = (array) =>
    array.length > 1 ? arrayFrom(new Set(array)) : array;

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

  function getElements(selector, context = doc, findSelf = false) {
    if (isElement(selector)) {
      return [selector];
    }
    let result = selector;
    if (isString(context)) {
      context = doc.querySelector(context);
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

  var closest = (elem, selectors) =>
    getElements(selectors).find((t) => t === elem || t.contains(elem));

  var map = (elems, fn) => getElements(elems).map(fn);

  var filter = (elems, selector) => {
    const isFn = isFunction(selector);
    elems = arrayFrom(elems);
    return selector
      ? elems.filter((elem, i, list) =>
          isFn ? selector(elem, i, list) : is(elem, selector),
        )
      : elems;
  };

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

  var focus = (elem, opts = { preventScroll: true }) =>
    elem && elem.focus(opts);

  var getElement = (selector, context, findSelf) =>
    getElements(selector, context, findSelf)[0];

  var inDOM = (elem) => elem && body.contains(elem);

  var nextAll = (elem, selector, until) =>
    dir(elem, "nextElementSibling", selector, until);

  var next = (elem, selector) => nextAll(elem, selector)[0];

  var parents = (elem, selector, until) =>
    dir(elem, "parentElement", selector, until);

  var removeAttribute = (elem, ...names) => {
    if (isArray(elem)) {
      elem.forEach((elem) =>
        names.forEach((name) => elem && elem.removeAttribute(camelToKebab(name))),
      );
    } else {
      names.forEach((name) => elem && elem.removeAttribute(camelToKebab(name)));
    }
  };

  var removeClass = (elem, classes) => toggleClass(elem, classes, false);

  function setAttribute(elem, name, value) {
    if (!elem) return;
    name = camelToKebab(name);
    if (isArray(elem)) {
      return elem.forEach((elem) => setAttribute(elem, name, value));
    }
    if (isFunction(value)) {
      value = value(elem.name);
    }
    if (value === null) {
      elem.removeAttribute(name);
    } else if (value !== undefined) {
      elem.setAttribute(name, value);
    }
  }

  var without = (source, ...values) =>
    returnArray(source).filter((elem) => !values.includes(elem));

  var animateClass = (elem, className) => {
    elem.classList.remove(className);
    elem.offsetWidth;
    elem.classList.add(className);
    const animations = elem.getAnimations();
    Promise.allSettled(animations.map(({ finished }) => finished)).then(() => {
      elem.classList.remove(className);
    });
  };

  var getBoundingClientRect = (elem) => elem.getBoundingClientRect().toJSON();

  var getPropertyValue = (style, name) => style.getPropertyValue(name).trim();

  const supportsDir = CSS.supports("selector(:dir(rtl))");
  var isRtl = (elem) =>
    supportsDir
      ? elem.matches(":dir(rtl)")
      : elem.closest("[dir]")?.dir === "rtl";

  var callOrReturn = (value, ...data) => (isFunction(value) ? value(...data) : value);

  var checkHash = (id) => location.hash.substring(1) === id;

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
          if (isString(value)) {
            elem.style = value;
          } else {
            addStyle(elem, value);
          }
        } else {
          setAttribute(elem, camelToKebab(name), value);
        }
      });
    }
    content.forEach((item) => item && elem.append(item));
    return elem;
  };

  var createInset = (input, returnArray, isRtl) => {
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
        [top, right, bottom] = input;
        left = right;
      } else {
        [top, right, bottom, left] = input;
      }
    } else if (isObject(input)) {
      ({ top = 0, right = 0, bottom = 0, left = 0 } = input);
    }

    if (isRtl) {
      [right, left] = [left, right];
    }

    return returnArray
      ? [top, right, bottom, left]
      : { top, right, bottom, left };
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
  const viewRect = visualViewport;

  function getPosition ({
    anchorRect,
    targetRect,
    arrow,
    placement,
    boundaryOffset = 0,
    offset = 0,
    padding = 0,
    shrink = false,
    flip = false,
    sticky = false,
    minWidth = 0,
    minHeight = 0,
    border,
    isRtl = false,
  }) {
    boundaryOffset = createInset(boundaryOffset, false, isRtl);

    flip = isArray(flip) ? flip : [flip];
    flip[1] ??= flip[0];

    padding = isArray(padding) ? padding : [padding];
    padding[1] ??= padding[0];

    if (sticky) {
      flip[1] = false;
    }

    let [baseM, baseS = CENTER] = placement.split("-");

    if (baseM === START) {
      baseM = isRtl ? RIGHT : LEFT;
    } else if (baseM === END) {
      baseM = isRtl ? LEFT : RIGHT;
    }

    const hor = baseM === LEFT || baseM === RIGHT;

    if (isRtl && !hor) {
      baseS = MIRROR[baseS];
    }

    const size = hor ? WIDTH : HEIGHT;
    const dir = hor ? LEFT : TOP;
    const dirS = hor ? TOP : LEFT;

    const minRect = { [WIDTH]: minWidth, [HEIGHT]: minHeight };

    let useFlipM = null;
    let useFlipS = null;

    const hasScale =
      viewRect.scale !== 1 && Math.abs(window.innerWidth - viewRect.width) > 2;

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
        [RIGHT]: viewRect[WIDTH] - anchorRect[LEFT] - anchorRect[WIDTH],
        [BOTTOM]: viewRect[HEIGHT] - anchorRect[TOP] - anchorRect[HEIGHT],
      };

      if (hasScale) {
        anchorSpace[TOP] -= viewRect.offsetTop;
        anchorSpace[LEFT] -= viewRect.offsetLeft;
        anchorSpace[RIGHT] += viewRect.offsetLeft;
        anchorSpace[BOTTOM] += viewRect.offsetTop;
      }

      const pageOffset = hasScale
        ? hor
          ? viewRect.offsetTop
          : viewRect.offsetLeft
        : 0;

      anchorSpace[m] -= offset + boundaryOffset[m];
      anchorSpace[MIRROR[m]] -= boundaryOffset[dirS] + boundaryOffset[mirrorDirS];

      const sumBoundaryOffsetS =
        boundaryOffset[mirrorDirS] + boundaryOffset[dirS];

      let availableSizesOffset;
      if (sticky) {
        availableSizesOffset = viewRect[mirrorSize] - sumBoundaryOffsetS;
      } else {
        availableSizesOffset = viewRect[mirrorSize] - anchorRect[mirrorSize] / 2;
        if (isStart) {
          availableSizesOffset =
            anchorSpace[mirrorDirS] +
            anchorRect[mirrorSize] -
            sumPadding -
            boundaryOffset[mirrorDirS];
        } else if (isEnd) {
          availableSizesOffset =
            anchorSpace[dirS] +
            anchorRect[mirrorSize] -
            sumPadding -
            boundaryOffset[dirS];
        }
      }

      const availableSizes = {
        [size]: max(minRect[size], anchorSpace[m]),
        [mirrorSize]: max(minRect[mirrorSize], availableSizesOffset),
      };

      const currentSize = {
        [size]: shrink
          ? min(targetRect[size], availableSizes[size])
          : targetRect[size],
        [mirrorSize]: shrink
          ? min(targetRect[mirrorSize], availableSizes[mirrorSize])
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

        const targetOffset =
          anchorSpace[isStart ? mirrorDirS : dirS] +
          anchorRect[mirrorSize] -
          targetRect[mirrorSize] -
          padding[isStart ? 0 : 1] -
          boundaryOffset[isStart ? mirrorDirS : dirS];

        if (flip[1] && targetOffset < 0) {
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
          (targetRect[mirrorSize] - anchorRect[mirrorSize]) / 2;
      } else {
        so = anchorRect[mirrorDirS] - targetRect[mirrorSize] - padding[1];
      }

      const staticSo = so;

      if (sticky) {
        if (so < boundaryOffset[dirS] + pageOffset) {
          if (!isStart) {
            so = boundaryOffset[dirS] + pageOffset;
            if (
              anchorRect[dirS] - pageOffset <
              boundaryOffset[dirS] - padding[0]
            ) {
              so = anchorRect[dirS] + padding[0];
            }
          }
        } else if (
          so + currentSize[mirrorSize] + boundaryOffset[mirrorDirS] >
          viewRect[mirrorSize] + pageOffset
        ) {
          if (!isEnd) {
            so -=
              so +
              currentSize[mirrorSize] -
              viewRect[mirrorSize] -
              pageOffset +
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
        // eslint-disable-next-line prefer-const
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

        let mo = -arrow[mirrorSize] / 2 + (isMainDir ? -offset : offset);

        if (isMainDir) {
          mo += currentSize[size];
          mo = mo - border[dir] - border[MIRROR[dir]] - 0.1;
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
        [AVAILABLE_WIDTH]: availableSizes[WIDTH],
        [AVAILABLE_HEIGHT]: availableSizes[HEIGHT],
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

  var uuidGenerator = (prefix = UI_PREFIX) =>
    prefix + Math.random().toString(36).substring(2, 12);

  var updateOptsByData = (opts, { dataset }, names, booleanOptions) => {
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
        if (booleanOptions?.includes(optionName)) {
          const isTrue = value === "" || value === TRUE;
          const isFalse = value === FALSE;
          const isAuto = value === AUTO;
          const isPrevent = value === PREVENT;
          value = isTrue
            ? true
            : isFalse
            ? false
            : isAuto || isPrevent
            ? value
            : undefined;
        } else if (value && value[0] === "{") {
          value = JSON.parse(value);
        }

        if (value !== undefined) {
          opts[optionName] = value;
        }
      }
    });
    return opts;
  };

  var getEventsPrefix = (name) => UI_PREFIX + name + ":";

  var getClassActive = (name) => UI_PREFIX + (name ? name + "-" : "") + ACTIVE;

  var getDefaultToggleSelector = (id, multiply) =>
    `[${DATA_UI_PREFIX + ACTION_TOGGLE}${
    multiply ? "~" : ""
  }="${id}"],[href$="#${id}"]`;

  const registerProperty = CSS.registerProperty;

  var ResetFloatingCssVariables = () => {
    let css = "";
    [TOOLTIP, DROPDOWN, POPOVER].forEach((name) => {
      const PREFIX = VAR_UI_PREFIX + name + "-";
      [STICKY, FLIP, SHRINK, PLACEMENT, PADDING, OFFSET, BOUNDARY_OFFSET].forEach(
        (prop) => {
          if (registerProperty) {
            registerProperty({
              name: PREFIX + prop,
              syntax: "*",
              inherits: false,
            });
          } else {
            css += PREFIX + prop + ":;";
          }
        },
      );
    });

    if (!registerProperty) {
      doc.head.appendChild(createElement(STYLE, false, `*{${css}}`));
    }
  };

  var valuesToArray = ({ value }) => value.trim().split(" ").map(parseFloat);

  var collectCssVariables = (anchorStyles, targetStyles, target, PREFIX) => {
    const valuesNames = [
      PADDING,
      OFFSET,
      BOUNDARY_OFFSET,
      ARROW_OFFSET,
      ARROW_PADDING,
      ARROW_WIDTH,
      ARROW_HEIGHT,
    ];
    const values = valuesNames
      .map((name) => {
        let value =
          getPropertyValue(anchorStyles, PREFIX + name) ||
          getPropertyValue(targetStyles, PREFIX + name);
        if (!value) return;

        value = value.replace(/\n/g, "").split(" ").filter(Boolean);

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

    target.style.setProperty(CLIP_PATH_PROPERTY, `polygon(${polygonValues})`);

    const targetComputedStyle = getComputedStyle(target);

    const computedValues = targetComputedStyle[CLIP_PATH_PROPERTY].slice(8, -1)
      .split(",")
      .values();

    const result = { targetComputedStyle };

    if (values.length) {
      values.forEach(({ name }) => {
        let value = valuesToArray(computedValues.next());
        if (name === BOUNDARY_OFFSET) {
          value = [...value, ...valuesToArray(computedValues.next())];
        } else if (name === OFFSET || name === ARROW_OFFSET) {
          value = value[0];
        }
        result[kebabToCamel(name)] = value;
      });
    }

    if (values.length) {
      target.style.removeProperty(CLIP_PATH_PROPERTY);
    }

    return result;
  };

  var isShown = (elem, stateMode) => {
    return stateMode === ACTION_REMOVE
      ? inDOM(elem)
      : stateMode === CLASS_HIDDEN_MODE
      ? !elem.classList.contains(HIDDEN_CLASS)
      : stateMode === CLASS_SHOWN_MODE
      ? elem.classList.contains(SHOWN_CLASS)
      : !elem.hasAttribute(
          stateMode === MODE_HIDDEN_UNTIL_FOUND ? HIDDEN : stateMode,
        );
  };

  var getBooleanDataAttrValue = (elem, name) => {
    const value = elem.getAttribute(DATA_UI_PREFIX + name);
    return value === null ? value : value !== FALSE;
  };

  var getDatasetValue = (elem, name, property) => {
    let datasetValue = elem.getAttribute(DATA_UI_PREFIX + name)?.trim() || "";
    const isDataObject = datasetValue[0] === "{";
    if (datasetValue) {
      if (isDataObject) {
        datasetValue = JSON.parse(datasetValue);
      } else if (property) {
        datasetValue = { [property]: datasetValue };
      }
    }
    return property ? datasetValue : [datasetValue, isDataObject];
  };

  var awaitPromise = async (promise, callback) => {
    await promise;
    callback();
  };

  var isClickOutsideElem = (elem, { clientX, clientY }) => {
    if (!clientX && !clientY) return false;
    const rect = getBoundingClientRect(elem);
    return (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    );
  };

  var resetTransition = (elem, after) => {
    const cache = elem.style.transition;
    elem.style.transition = NONE;
    after?.();
    elem.offsetWidth;
    elem.style.transition = cache;
  };

  var addStatusClasses = (instance, ...statuses) => {
    const { opts } = instance;
    const base = instance[instance.constructor.NAME];
    statuses.forEach((status) => {
      let s, className;
      if (status === BACKDROP) {
        s = !!instance[BACKDROP];
        className = "has-" + BACKDROP;
      } else if (status === MODAL) {
        s = opts[MODAL];
        className = MODAL;
      } else if (status === OPTION_PREVENT_SCROLL) {
        s =
          opts[OPTION_PREVENT_SCROLL] === AUTO
            ? opts[MODAL]
            : opts[OPTION_PREVENT_SCROLL];
        className = "prevents-scroll";
      } else if (status === OPTION_TOP_LAYER) {
        s = opts[OPTION_TOP_LAYER] || opts[OPTION_MOVE_TO_ROOT];
        className = "root-relative";
      }
      base.classList.toggle(UI_PREFIX + className, s);
    });
  };

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
        } else {
          elems = getElements(elems);
        }
        elems.forEach((elem) => {
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

  if (!POPOVER_API_SUPPORTED) {
    ROOT_ELEM.classList.add(UI_PREFIX + "no-" + POPOVER);
  }

  function getDataValue(_data, dataName, elem) {
    const value = callOrReturn(_data[dataName], elem);
    if (!isObject(value)) return {};
    return _data[value.data]
      ? { ...getDataValue(_data, value.data, elem), ...value }
      : value;
  }

  class Base {
    static allInstances = new Set();
    static components = {};
    constructor(elem, opts) {
      if (isFunction(opts)) {
        opts = opts(elem);
      }
      opts ??= {};
      const { NAME, BASE_NODE_NAME, Default, _data, _templates, allInstances } =
        this.constructor;

      if (
        elem?.id &&
        arrayFrom(allInstances).find(
          (instance) =>
            instance.base === elem && instance.constructor.NAME === NAME,
        )
      )
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

        if (!elem) return;

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

      this._events = {};

      this.baseOpts = this.opts = opts;

      this.uuid = uuidGenerator();

      this.id = elem.id || this.uuid;

      const eventHandler = new EventHandler();
      [ACTION_ON, ACTION_OFF, ACTION_ONCE].forEach((name) => {
        this[`_${name}`] = (...params) => {
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
        ACTION_ON,
        ACTION_OFF,
        "_" + ACTION_EMIT,
      ].forEach((action) => (this[action] = this[action]?.bind(this)));

      allInstances.add(this);

      if (this.baseOpts.breakpoints) {
        this._initBreakpoints();
      } else {
        this.init();
      }

      return this;
    }
    _initBreakpoints() {
      this.breakpoints = new Breakpoints(
        { 0: this.baseOpts, ...this.baseOpts.breakpoints },
        {
          onUpdate: (breakpoint, opts) => {
            this._emit(EVENT_BREAKPOINT, breakpoint, this.breakpoint);
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
              Base.allInstances.forEach((instance) => {
                if (
                  instance.breakpoints &&
                  instance.base === this.base &&
                  instance !== this &&
                  instance.isInit &&
                  instance.breakpoints.checkBreakpoints()[0].destroy
                ) {
                  instance.destroy({ keepInstance: true });
                }
              });
              this.init();
            }
            this.breakpoint = breakpoint;
          },
        },
      );
    }
    _emit(eventName, ...detail) {
      const { opts, base } = this;
      const { on, eventDispatch, eventBubble, eventPrefix } = opts;
      detail = [this, ...detail];

      this._events[eventName]?.(...detail);
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
    on(name, handler) {
      this._events[name] = handler;
      return this;
    }
    off(name) {
      if (name) {
        delete this._events[name];
      } else {
        this._events = {};
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
      const instances = this === Base ? Base.allInstances : this.instances;
      if (elem === undefined) return [...instances.values()];
      const entries =
        this === Base
          ? [...instances].map((instance) => [instance.id, instance])
          : instances.entries();
      for (const [id, instance] of entries) {
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

  var ToggleMixin = (Base, NAME) =>
    class extends Base {
      static _data = {};
      static instances = new Map();
      static get NAME() {
        return NAME;
      }
      get isAnimating() {
        return this.transition?.isAnimating;
      }
      get initialPlaceNode() {
        return (
          this.teleport?.placeholder ??
          this.placeholder ??
          this[this.constructor.NAME]
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

  class Transition {
    static Default = {
      enabled: AUTO,
      name: UI,
      css: true,
      cssVariables: false,
      [ENTER]: null,
      [ENTER_ACTIVE]: null,
      [ENTER_FROM]: null,
      [ENTER_TO]: null,
      [LEAVE]: null,
      [LEAVE_FROM]: null,
      [LEAVE_ACTIVE]: null,
      [LEAVE_TO]: null,
      [DURATION]: null,
    };

    constructor(elem, opts, defaultOpts) {
      this.elem = elem;
      this.update(opts, defaultOpts);
      this.promises = [];

      this.isInit = true;
    }
    update(opts, defaultOpts = {}) {
      opts = isString(opts) ? { name: opts } : opts;

      opts = {
        ...Transition.Default,
        ...defaultOpts,
        ...opts,
      };

      this.opts = updateOptsByData(opts, this.elem, [
        ENTER_ACTIVE,
        ENTER_FROM,
        ENTER_TO,
        LEAVE_ACTIVE,
        LEAVE_FROM,
        LEAVE_TO,
        [NAME, TRANSITION + "Name"],
      ]);

      return this;
    }

    toggleVariables(s) {
      const { offsetWidth, offsetHeight, style } = this.elem;
      [WIDTH, HEIGHT].forEach((name, i) => {
        const prop = VAR_UI_PREFIX + TRANSITION + "-" + name;
        if (s) {
          style.setProperty(prop, (i ? offsetHeight : offsetWidth) + PX);
        } else {
          style.removeProperty(prop);
        }
      });
    }

    toggleAnimationClasses(s) {
      resetTransition(this.elem, () =>
        this.setClasses([s ? ENTER_FROM : LEAVE_FROM]),
      );
      this.setClasses([s ? ENTER_ACTIVE : LEAVE_ACTIVE, s ? ENTER_TO : LEAVE_TO]);
      return this;
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

    async run(s, animated = true) {
      const { elem, opts } = this;
      if (!elem) return;

      let isEnabled = callOrReturn(opts.enabled, elem);
      if (opts.enabled === AUTO) {
        isEnabled = window.matchMedia(
          "(prefers-reduced-motion:no-preference)",
        ).matches;
      }

      if (isEnabled && animated) {
        if (opts.css) {
          opts.cssVariables && this.toggleVariables(true);
          this.toggleAnimationClasses(s);
        }

        this.collectPromises(s);
        if (this.promises.length) {
          await this.getAwaitPromise();
        }
        if (opts.css) {
          opts.cssVariables && this.toggleVariables(false);
        }
      }

      this.setClasses(null);
      this.promises.length = 0;
    }
    destroy() {
      this.setClasses(null);
      this.isInit = false;
    }
    static createOrUpdate(transition, elem, opts, defaultOpts) {
      if (!opts) {
        transition?.destroy();
        return;
      }
      return transition
        ? transition.update(opts, defaultOpts)
        : new Transition(elem, opts, defaultOpts);
    }
  }

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

  const eventName = EVENT_CLICK + UI_EVENT_PREFIX + "-" + DISMISS;
  function addDismiss (
    instance,
    elem = instance.base,
    action = instance.hide,
  ) {
    instance._on(
      elem,
      eventName,
      isString(instance.opts[DISMISS])
        ? instance.opts[DISMISS]
        : `[${DATA_UI_PREFIX + DISMISS}=""],[${DATA_UI_PREFIX + DISMISS}="${
          instance.constructor.NAME
        }"]`,
      (event) => {
        if (event.__dismissTriggered) return;
        event.preventDefault();
        event.__dismissTriggered = true;
        const eventParams = { event, trigger: event.deligateTarget };
        action(eventParams);
        if (instance.constructor[PRIVATE_OPTION_CANCEL_ON_HIDE]) {
          instance._emit(CANCEL, eventParams);
        }
      },
    );
  }

  const stack = [];

  const CloseWatcher =
    window.CloseWatcher ||
    class CloseWatcher extends EventTarget {
      isActive = true;
      oncloseHandler = null;
      constructor() {
        super();
        stack.push(this);
      }

      destroy() {
        this.deactivate();
      }

      close() {
        if (!this.isActive || !document.defaultView) return;

        this.dispatchEvent(new Event(EVENT_CLOSE));
        this.deactivate();
      }

      deactivate() {
        this.isActive = false;
        const index = stack.indexOf(this);
        if (index !== -1) {
          stack.splice(index, 1);
        }
      }

      set onclose(handler) {
        if (this.oncloseHandler && handler === null) {
          this.removeEventListener(EVENT_CLOSE, this.oncloseHandler);
          this.oncloseHandler = null;
        } else {
          this.oncloseHandler = handler;
          this.addEventListener(EVENT_CLOSE, this.oncloseHandler);
        }
      }
    };

  if (!window.CloseWatcher) {
    doc.addEventListener(EVENT_KEYDOWN, (event) => {
      if (!event.isTrusted || event.keyCode !== KEY_ESC) return;

      const closeWatcher = stack.at(-1);

      if (!closeWatcher) return;

      setTimeout(() => {
        if (event.defaultPrevented) return;
        closeWatcher.close();
      }, 0);
    });
  }

  function toggleBackDismiss (s, instance) {
    const { base, _on, _off, opts } = instance;

    if (isDialog(base)) {
      if (s) {
        _on(base, CANCEL + UI_EVENT_PREFIX, (event) => {
          event.preventDefault();
        });
      } else {
        _off(base, CANCEL + UI_EVENT_PREFIX);
      }
    }
    if (s) {
      if (
        opts[OPTION_BACK_DISMISS] === AUTO
          ? opts[MODAL]
          : opts[OPTION_BACK_DISMISS]
      ) {
        instance._closeWatcher = new CloseWatcher();
        instance._closeWatcher.onclose = (event) => {
          instance.hide({ event });
        };
      }
    } else {
      instance._closeWatcher?.destroy();
      instance._closeWatcher = null;
    }
  }

  var callAutofocus = (instance, elem = instance.base) => {
    const autofocus = instance.opts.autofocus;
    let focusElem = getOptionElem(
      instance,
      autofocus === true
        ? `[${AUTOFOCUS}],[${DATA_UI_PREFIX + AUTOFOCUS}=""],[${
          DATA_UI_PREFIX + AUTOFOCUS
        }="${instance.constructor.NAME}"]`
        : autofocus,
      elem,
    );

    focusElem ||= elem.contains(doc.activeElement) && doc.activeElement;

    if (!focusElem && !isDialog(elem)) {
      focusElem = elem.querySelector(FOCUSABLE_ELEMENTS_SELECTOR) ?? elem;
    }

    focus(focusElem);
  };

  var baseDestroy = (
    instance,
    { remove = false, keepInstance = false, keepState = false } = {},
  ) => {
    const { base, _off, _emit, constructor } = instance;

    const stateElem = instance[constructor.NAME];

    instance[PLACEHOLDER]?.replaceWith(base);

    ["autohide", FLOATING, TRANSITION, TELEPORT].forEach((key) => {
      if (instance[key]) {
        instance[key].destroy();
        instance[key] = null;
      }
    });

    _off();

    if (!keepInstance) {
      destroyInstance(instance);
    }
    if (remove) {
      base.remove();
    } else if (!keepState) {
      removeClass(stateElem, [HIDDEN_CLASS, SHOWN_CLASS]);
      removeAttribute(stateElem, HIDDEN, INERT);
    }

    instance.isInit = false;

    toggleInitClass(instance, false);

    _emit(EVENT_DESTROY);

    return instance;
  };

  const PREFIX = UI_EVENT_PREFIX + "-" + TRIGGER;

  var toggleOnInterection = (
    instance,
    toggler = instance.toggler,
    target = instance.base,
  ) => {
    let {
      opts: { trigger, delay, mode },
      toggle,
      _on,
    } = instance;

    if (instance[PRIVATE_PREFIX + TRIGGER]) {
      instance.off("*", PREFIX);
      instance[PRIVATE_PREFIX + TRIGGER] = false;
    }

    if (!trigger) return;

    const triggerClick = trigger.includes(CLICK);
    const triggerHover = mode !== MODAL && trigger.includes(HOVER);
    const triggerFocus = mode !== MODAL && trigger.includes(FOCUS);
    const events = [];
    let isMouseDown = false;
    let hoverTimer;
    if (triggerHover) {
      delay = isArray(delay) ? delay : [delay, delay];
    }

    let pointerType;
    _on(toggler, "pointerdown" + PREFIX, (event) => {
      pointerType = event.pointerType;
    });

    if (triggerClick) {
      _on(toggler, EVENT_CLICK + PREFIX, (event) => {
        if (
          (pointerType === MOUSE && triggerHover) ||
          (instance.isOpen &&
            instance.transition?.isAnimating &&
            instance.floating.floatings.size)
        ) {
          pointerType = null;
          return;
        }

        toggle(null, { event, trigger: toggler });
      });
    }
    if (triggerHover) {
      events.push(EVENT_MOUSEENTER + PREFIX, EVENT_MOUSELEAVE + PREFIX);
    }
    if (triggerFocus) {
      events.push(EVENT_FOCUSIN + PREFIX, EVENT_FOCUSOUT + PREFIX);

      (triggerClick || triggerFocus) &&
        _on(toggler, EVENT_MOUSEDOWN, () => {
          isMouseDown = true;
          if (instance.isOpen) {
            clearTimeout(hoverTimer);
          }
          requestAnimationFrame(() => (isMouseDown = false));
        });
    }

    if (triggerHover || triggerFocus) {
      _on([toggler, target], events, (event) => {
        const { type } = event;
        if (pointerType === "touch") return;
        const isFocus = type === EVENT_FOCUSIN || type === EVENT_FOCUSOUT;

        if (
          (type === EVENT_FOCUSIN && isMouseDown) ||
          (type === EVENT_FOCUSOUT &&
            triggerHover &&
            toggler.matches(":" + HOVER))
        ) {
          return;
        }

        const entered =
          (triggerHover && type === EVENT_MOUSEENTER) ||
          (triggerFocus && type === EVENT_FOCUSIN);
        const d = isFocus ? 0 : delay[entered ? 0 : 1];
        clearTimeout(hoverTimer);

        if (d) {
          hoverTimer = setTimeout(() => {
            toggle(entered, { trigger: toggler, event });
          }, d);
        } else {
          toggle(entered, { trigger: event.target, event });
        }
      });
    }

    instance[PRIVATE_PREFIX + TRIGGER] = true;
  };

  const FOCUS_GUARD = FOCUS + "-guard";

  class FocusGuards {
    constructor(target, opts = {}) {
      this.target = target;
      this.opts = opts;
      this.init();
    }
    init() {
      const { target, opts } = this;

      this.onFocus = (e) => {
        let returnElem = opts.anchor;
        let focusFirst = false;
        const isGuardBefore =
          e.target.getAttribute(DATA_UI_PREFIX + FOCUS_GUARD) === BEFORE;

        if (opts.focusAfterAnchor && returnElem) {
          if (!isGuardBefore) {
            const globalReturnElems = [
              ...doc.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
            ];
            returnElem =
              globalReturnElems[
                globalReturnElems.findIndex((el) => el === returnElem) + 1
              ];
          }
          opts.onFocusOut && opts.onFocusOut();
          return focus(returnElem);
        }

        if (e.relatedTarget === returnElem) {
          focusFirst = true;
        }

        (
          arrayFrom(target.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR)).at(
            !focusFirst && isGuardBefore ? -1 : 0,
          ) || target
        )?.focus();
      };

      this.focusGuards = [BEFORE, AFTER].map((methodName) => {
        const focusGuard = createElement("span", {
          [TABINDEX]: 0,
          [DATA_UI_PREFIX + FOCUS_GUARD]: methodName,
          style: `outline:none;opacity:0;position:fixed;pointer-events:none;`,
        });
        target[methodName](focusGuard);
        focusGuard.addEventListener(FOCUS, this.onFocus);
        return focusGuard;
      });
    }
    destroy() {
      this.focusGuards.forEach((focusGuard) => {
        focusGuard.remove();
        focusGuard.removeEventListener(FOCUS, this.onFocus);
      });
    }
  }

  const destroyTopLayer = (elem) => {
    elem.popover && elem.hidePopover?.();
    elem.close?.();
    elem.popover = null;
  };

  const addPopoverAttribute = (instance, elem = instance.base) => {
    elem.popover =
      instance.opts.topLayer &&
      (!instance.opts[MODAL] || !isDialog(elem)) &&
      POPOVER_API_SUPPORTED
        ? POPOVER_API_MODE_MANUAL
        : null;
  };

  const toggleTopLayer = (instance, s) => {
    const { constructor, opts } = instance;
    const target = instance[constructor.NAME];
    const targetIsDialog = isDialog(target);
    const targetIsModal = targetIsDialog && opts[MODAL] && opts.topLayer;
    const targetIsPopover =
      opts.topLayer && POPOVER_API_SUPPORTED && target.popover;

    if (s) {
      if (targetIsDialog) {
        if (targetIsModal) {
          if (target.open) target.close();
          target.showModal();
          constructor.dispatchTopLayer(MODAL);
        } else {
          if (targetIsPopover) {
            target.close?.();
            target.showPopover();
            constructor.dispatchTopLayer(POPOVER);
          } else {
            target.show();
          }
        }
      } else if (targetIsPopover) {
        target.showPopover();
        constructor.dispatchTopLayer(POPOVER);
      }
    } else {
      target.close?.();
      target[POPOVER] && target.hidePopover?.();
    }
  };

  ResetFloatingCssVariables();

  const OPTIONS = [
    FLIP,
    STICKY,
    SHRINK,
    PLACEMENT,
    OPTION_TOP_LAYER,
    OPTION_MOVE_TO_ROOT,
  ];

  const CURRENT_PLACEMENT_ATTRIBUTE = DATA_UI_PREFIX + "current-" + PLACEMENT;
  const TRANSFORM_ORIGIN = "transform-origin";
  const CSS_VARIABLES = [
    LEFT,
    TOP,
    AVAILABLE_WIDTH,
    AVAILABLE_HEIGHT,
    WIDTH,
    HEIGHT,
    ARROW + "-" + LEFT,
    ARROW + "-" + TOP,
    ANCHOR + "-" + WIDTH,
    ANCHOR + "-" + HEIGHT,
    TRANSFORM_ORIGIN,
  ].map((name) => VAR_UI_PREFIX + FLOATING + "-" + name);

  class Floating {
    static instances = new Set();
    constructor({ target, anchor, arrow, opts, name = "", base, instance }) {
      const { on, off } = new EventHandler();

      Object.assign(this, {
        target,
        anchor,
        arrow,
        opts,
        name,
        on,
        off,
        base,
        instance,
        floatings: new Set(),
      });
    }
    init() {
      const { target, anchor, arrow, opts, base, name, on, instance } = this;
      const PREFIX = VAR_UI_PREFIX + name + "-";
      const FLOATING_PREFIX = VAR_UI_PREFIX + FLOATING + "-";

      target.setAttribute(DATA_UI_PREFIX + FLOATING, name);

      const anchorScrollParents = parents(anchor, isOverflowElement, body);
      const anchorStyles = getComputedStyle(anchor);
      const targetStyles = getComputedStyle(target);

      const options = {};
      OPTIONS.forEach((name) => {
        const variableName = camelToKebab(name);
        return (options[name] =
          getPropertyValue(anchorStyles, PREFIX + variableName) ||
          getPropertyValue(targetStyles, PREFIX + variableName));
      });

      const border = Object.fromEntries(
        [TOP, RIGHT, BOTTOM, LEFT].map((side) => [
          side,
          parseFloat(getPropertyValue(targetStyles, `border-${side}-width`)),
        ]),
      );

      OPTIONS.forEach((name) => {
        if (name === FLIP) {
          options[FLIP] = options[FLIP]
            ? options[FLIP].split(" ").map((v) => v === "1")
            : returnArray(opts[FLIP]);
        } else if (name === PLACEMENT) {
          options[name] =
            base.getAttribute(DATA_UI_PREFIX + camelToKebab(name)) ||
            options[name] ||
            opts[name];
        } else {
          options[name] =
            options[name] === "1"
              ? true
              : options[name] === "0"
              ? false
              : opts[name];
        }
        this[name] = options[name];
      });

      let { shrink, sticky, topLayer, moveToRoot, flip, placement } = this;

      const targetIsModal = opts[MODAL] && isDialog(target);

      const usePopoverApi = topLayer && !targetIsModal && POPOVER_API_SUPPORTED;

      const inTopLayer =
        (topLayer && POPOVER_API_SUPPORTED) || targetIsModal || moveToRoot;

      const focusTrap = opts.focusTrap === AUTO ? opts[MODAL] : opts.focusTrap;

      const useFocusGuards =
        (focusTrap && !targetIsModal) || (usePopoverApi && moveToRoot);

      if (moveToRoot && !targetIsModal && !opts.focusTrap) {
        on(anchor, EVENT_KEYDOWN, (e) => {
          if (e.keyCode === KEY_TAB && !e.shiftKey) {
            const focusElem = target.querySelector(FOCUSABLE_ELEMENTS_SELECTOR);
            if (focusElem) {
              e.preventDefault();
              focus(focusElem);
            }
          }
        });
      }

      if (useFocusGuards) {
        this.focusGuards = new FocusGuards(target, {
          focusAfterAnchor: !opts.focusTrap,
          anchor,
          topLayer,
          onFocusOut:
            isDialog(target) &&
            (() => {
              instance.hide?.();
            }),
        });
      }

      if (placement === DIALOG) {
        setAttribute(target, CURRENT_PLACEMENT_ATTRIBUTE, DIALOG);
        toggleTopLayer(instance, true);
        return this;
      }

      const {
        padding,
        offset = opts.offset,
        boundaryOffset = opts.boundaryOffset,
        arrowOffset,
        arrowPadding,
        arrowWidth,
        arrowHeight,
      } = collectCssVariables(anchorStyles, targetStyles, target, PREFIX);

      let anchorRect = getBoundingClientRect(anchor);

      const targetRect = {
        [WIDTH]: target.offsetWidth,
        [HEIGHT]: target.offsetHeight,
      };
      [WIDTH, HEIGHT].forEach((size) => {
        target.style.setProperty(FLOATING_PREFIX + size, targetRect[size] + PX);
        target.style.setProperty(
          FLOATING_PREFIX + ANCHOR + "-" + size,
          anchorRect[size] + PX,
        );
      });

      let arrowData;
      if (arrow || arrowWidth || arrowHeight) {
        arrowData = {
          [WIDTH]: arrowWidth?.[0] || arrow?.offsetWidth,
          [HEIGHT]: arrowHeight?.[0] || arrow?.offsetHeight,
        };
        arrowData[PADDING] = arrowPadding ?? opts[ARROW]?.padding ?? 0;
        arrowData[OFFSET] = arrowOffset ?? opts[ARROW]?.offset ?? 0;
      }

      if (!inTopLayer) {
        shrink = false;
        flip = false;
        sticky = false;
      }

      const params = {
        anchorRect,
        targetRect,
        arrow: arrowData,
        placement,
        inTopLayer,
        flip,
        sticky,
        shrink,
        offset,
        boundaryOffset,
        padding,
        border,
        minHeight: parseFloat(targetStyles.minHeight) || 0,
        minWidth: parseFloat(targetStyles.minWidth) || 0,
        isRtl: isRtl(anchor),
      };

      let prevTop = 0;
      const updatePosition = () => {
        anchorRect = getBoundingClientRect(anchor);

        if (!inTopLayer) {
          anchorRect.left = anchorRect.x = anchor.offsetLeft;
          anchorRect.top = anchorRect.y = anchor.offsetTop;
          anchorRect.right = anchor.offsetLeft + anchorRect.width;
          anchorRect.bottom = anchor.offsetTop + anchorRect.height;
        }

        const position = getPosition({ ...params, anchorRect });

        if (inTopLayer) {
          position.top += window.scrollY;
          position.left += window.scrollX;
        }

        if (prevTop && Math.abs(prevTop - position.top) > 50) {
          prevTop = position.top;

          return updatePosition();
        }
        prevTop = position.top;

        setAttribute(target, CURRENT_PLACEMENT_ATTRIBUTE, position[PLACEMENT]);

        if (shrink) {
          [AVAILABLE_WIDTH, AVAILABLE_HEIGHT].forEach((name) =>
            target.style.setProperty(FLOATING_PREFIX + name, position[name] + PX),
          );
        }

        [LEFT, TOP].forEach((dir, i) => {
          target.style.setProperty(FLOATING_PREFIX + dir, position[dir] + PX);
          if (arrowData) {
            target.style.setProperty(
              FLOATING_PREFIX + ARROW + "-" + dir,
              position.arrow[i] + PX,
            );
          }
        });

        target.style.setProperty(
          FLOATING_PREFIX + TRANSFORM_ORIGIN,
          `${position.transformOrigin[0]}px ${position.transformOrigin[1]}px`,
        );
      };

      observeResize(target, (width, height) => {
        targetRect[WIDTH] = width;
        targetRect[HEIGHT] = height;
        updatePosition();
      });

      updatePosition();

      toggleTopLayer(instance, true);

      on(
        [...anchorScrollParents, window, visualViewport],
        EVENT_SCROLL,
        updatePosition,
        {
          passive: true,
        },
      );

      on(visualViewport, EVENT_RESIZE, updatePosition, {
        passive: true,
      });

      this.updatePosition = updatePosition.bind(this);

      Floating.instances.add(this);

      this.parentFloating = arrayFrom(Floating.instances).find(
        (floating) => floating !== this && anchor.closest("#" + floating.base.id),
      );
      this.parentFloating?.floatings?.add(this);

      return this;
    }

    destroy() {
      const { target } = this;
      this.off();
      resizeObserver.unobserve(target);

      removeAttribute(
        target,
        DATA_UI_PREFIX + FLOATING,
        CURRENT_PLACEMENT_ATTRIBUTE,
      );

      toggleTopLayer(this.instance, false);

      CSS_VARIABLES.forEach((name) => target.style.removeProperty(name));

      this.focusGuards?.destroy();

      Floating.instances.delete(this);
      this.parentFloating?.floatings?.delete(this);
    }
  }

  var toggleStateMode = (
    s,
    instance,
    target = instance.base,
    subInstance = instance,
  ) => {
    const opts = instance.opts;
    const mode = opts[STATE_MODE];

    if (mode === ACTION_REMOVE) {
      if (s) {
        if (opts.keepPlace) {
          subInstance[PLACEHOLDER]?.replaceWith(target);
          subInstance[PLACEHOLDER] = null;
        } else {
          subInstance._floatingParent?.append(target);
        }
      } else {
        if (opts.keepPlace) {
          target.replaceWith(
            (subInstance[PLACEHOLDER] ||= doc.createComment(
              UI_PREFIX + PLACEHOLDER + ":" + target.id,
            )),
          );
        } else {
          const parent = target.parentElement;
          if (parent) {
            subInstance._floatingParent = parent.hasAttribute(
              FLOATING_DATA_ATTRIBUTE,
            )
              ? parent.parentElement
              : parent;
            target.remove();
          }
        }
      }
    } else if (mode !== CLASS_HIDDEN_MODE && mode !== CLASS_SHOWN_MODE) {
      if (mode === MODE_HIDDEN_UNTIL_FOUND) {
        if (s) {
          target[HIDDEN] = null;
          instance.off(target, EVENT_BEFORE_MATCH);
        } else {
          target.setAttribute(HIDDEN, UNTIL_FOUND);
          instance._on(target, EVENT_BEFORE_MATCH, (event) => {
            instance.show(target, { animated: false, event });
          });
        }
      } else {
        target.toggleAttribute(mode, !s);
      }
    }

    target.classList.toggle(HIDDEN_CLASS, !s && mode === CLASS_HIDDEN_MODE);
    target.classList.toggle(SHOWN_CLASS, s && mode === CLASS_SHOWN_MODE);

    if (s) {
      target[HIDDEN] = false;
    }
  };

  var floatingTransition = (instance, { s, animated, silent, eventParams }) => {
    const { transition, base, opts, toggler, _emit, constructor, teleport } =
      instance;
    const name = constructor.NAME;
    const target = instance[name];
    const anchor = toggler ?? base;

    s && toggleStateMode(true, instance, target);

    if (s) {
      teleport.move(instance);
      instance[FLOATING] = new Floating({
        base,
        anchor,
        target,
        name,
        arrow: target.querySelector(getDataSelector(name, ARROW)),
        opts,
        instance,
      }).init();
      togglePreventScroll(instance, true);
    }

    addFrameState(instance, s);

    !silent && _emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

    const promise = transition?.run(s, animated);

    toggleLightDismiss(instance, s);

    if (name === TOOLTIP) {
      if (s) {
        instance._on(doc, EVENT_KEYDOWN + "." + OPTION_BACK_DISMISS, (event) => {
          if (!event.isTrusted || event.keyCode !== KEY_ESC) return;
          instance.hide({ event });
        });
      } else {
        instance._off(doc, EVENT_KEYDOWN + "." + OPTION_BACK_DISMISS);
      }
    } else {
      toggleBackDismiss(s, instance);
    }

    if (s) {
      (opts.autofocus || opts.focusTrap) &&
        eventParams?.event?.type !== EVENT_MOUSEENTER &&
        callAutofocus(instance);
    } else {
      !s && target.contains(doc.activeElement) && focus(toggler);
    }

    (async () => {
      if (!s) {
        if (animated) {
          await promise;
        }
        if (instance.placeholder) {
          target.replaceWith(instance.placeholder);
        }
        teleport.reset();
        instance[FLOATING]?.destroy();
        instance[FLOATING] = null;
        toggleStateMode(false, instance, target);
        togglePreventScroll(instance, false);
      }
      _emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
    })();

    return promise;
  };

  var callShowInit = (instance, target = instance.base, stateElem = target) => {
    const { opts, show, id } = instance;

    instance.instances.set(id, instance);
    instance.isInit = true;
    toggleInitClass(instance, true);
    instance._emit(EVENT_INIT);

    const shown =
      callOrReturn(
        (opts.hashNavigation && checkHash(id)) || opts.shown,
        instance,
      ) ?? isShown(stateElem, opts.stateMode);

    if (shown) {
      show({
        animated: !!(
          getBooleanDataAttrValue(target, APPEAR) ??
          opts.appear ??
          instance._fromHTML
        ),
        __initial: true,
      });
    } else {
      toggleStateMode(false, instance, stateElem);
    }

    return instance;
  };

  var toggleConfirm = (instance) => {
    instance._on(instance.base, EVENT_CLICK + UI_EVENT_PREFIX, (event) => {
      const trigger = closest(event.target, instance.opts[CONFIRM]);
      trigger && instance._emit(CONFIRM, { event, trigger });
    });
  };

  var addHashNavigation = (instance) => {
    instance._on(window, "hashchange" + UI_EVENT_PREFIX, (event) => {
      if (checkHash(instance.id)) {
        instance.show({ event });
      }
    });
  };

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

  const FLOATING_IS_INTERACTED = ":is(:hover,:focus-within)";
  function checkFloatings (instance, s) {
    const floating = instance.floating;

    if (!floating) return;
    let parentFloating = floating.parentFloating;

    if (s) {
      while (parentFloating) {
        parentFloating.instance.show();
        parentFloating = parentFloating.parentFloating;
      }
    } else {
      if (
        parentFloating &&
        !parentFloating.base.matches(FLOATING_IS_INTERACTED) &&
        !parentFloating.anchor.matches(FLOATING_IS_INTERACTED)
      ) {
        parentFloating.instance.hide();
      }

      let floatings = arrayFrom(floating.floatings);
      while (floatings.length) {
        for (const childFloating of floatings) {
          if (childFloating.base.matches(FLOATING_IS_INTERACTED)) {
            instance.isOpen = true;
            return true;
          }
          floatings = arrayFrom(childFloating.floatings);
        }
      }
    }
  }

  var destroyInstance = (instance) => {
    instance.breakpoints?.destroy();
    instance.instances.delete(instance.id);
    Base.allInstances.delete(instance);
  };

  const PROPERTY_ROOT_SCROLLBAR_WIDTH =
    VAR_UI_PREFIX + ROOT + "-scrollbar-" + WIDTH;

  const PREVENT_SCROLL_CLASS = UI_PREFIX + ACTION_PREVENT + "-" + SCROLL;
  const updateBodyScrollbarWidth = (s) => {
    return s
      ? ROOT_ELEM.style.setProperty(
          PROPERTY_ROOT_SCROLLBAR_WIDTH,
          window.innerWidth - ROOT_ELEM.clientWidth + PX,
        )
      : ROOT_ELEM.style.removeProperty(PROPERTY_ROOT_SCROLLBAR_WIDTH);
  };

  const checkPreventScroll = (instance) => {
    const preventScrollOption = instance.opts[OPTION_PREVENT_SCROLL];
    if (!instance.isOpen) return;
    return preventScrollOption === AUTO
      ? instance.opts[MODAL]
      : preventScrollOption;
  };

  var togglePreventScroll = (instance, s) => {
    if (
      (s &&
        checkPreventScroll(instance) &&
        !ROOT_ELEM.classList.contains(PREVENT_SCROLL_CLASS)) ||
      (!s && !arrayFrom(Base.allInstances).find(checkPreventScroll))
    ) {
      updateBodyScrollbarWidth(s);
      ROOT_ELEM.classList.toggle(PREVENT_SCROLL_CLASS, s);
    }
  };

  var toggleInitClass = (instance, s) => {
    instance.base.classList.toggle(
      UI_PREFIX + instance.constructor.NAME + "-" + ACTION_INIT,
      s,
    );
  };

  var addLightDismiss = (instance) => {
    const { constructor, opts, _on, _emit } = instance;
    const base = instance[constructor.NAME];
    const contentElem = instance.main || base;

    const events = [
      EVENT_CLICK + EVENT_SUFFIX_LIGHT_DISMISS,
      EVENT_KEYUP + EVENT_SUFFIX_LIGHT_DISMISS,
      (opts[OPTION_LIGHT_DISMISS]?.contextMenuClick ?? true) &&
        EVENT_CONTEXT_MENU_CLICK + EVENT_SUFFIX_LIGHT_DISMISS,
    ];

    _on(contentElem, EVENT_MOUSEDOWN + EVENT_SUFFIX_LIGHT_DISMISS, (e) => {
      instance._mousedownEvent = e;
    });

    _on(document, events, (event) => {
      const target = event.target;
      if (
        !instance.isOpen ||
        instance._isOpening ||
        (opts.awaitAnimation && instance.transition?.isAnimating)
      )
        return;

      const _mousedownEvent = instance._mousedownEvent;
      const isBaseModal = isModal(base);

      let isClickOutside;

      if (
        !_mousedownEvent &&
        (target === instance.toggler || target === instance.anchor)
      ) {
        instance._mousedownEvent = null;
        return;
      }

      const backdrop = instance.backdrop;
      const isBackdropClick = !_mousedownEvent && target === backdrop;
      const isTargetNotInside =
        (!backdrop || !base.contains(backdrop)) &&
        !_mousedownEvent &&
        !base.contains(target);
      const targetIsBase = !backdrop && target === base;

      if (
        isBackdropClick ||
        isTargetNotInside ||
        (targetIsBase &&
          (!_mousedownEvent
            ? isClickOutsideElem(contentElem, event)
            : isClickOutsideElem(contentElem, _mousedownEvent)))
      ) {
        isClickOutside = true;
      }

      if (isClickOutside && (target === backdrop || isBaseModal)) {
        if (opts[OPTION_PREVENT_DISMISS]) {
          instance._mousedownEvent = null;
          animateClass(
            contentElem,
            camelToKebab(UI_PREFIX + EVENT_DISMISS_PREVENTED),
          );
          _emit(EVENT_DISMISS_PREVENTED, { event });
          return;
        }
      }

      if (!isClickOutside && !opts.modal && !target.closest("#" + instance.id)) {
        const targetInstance =
          constructor.get(target) ||
          parents(
            target,
            `[${FLOATING_DATA_ATTRIBUTE}],.${UI_PREFIX + DIALOG}-init`,
          ).find((parent) => Base.get(parent));

        if ((!targetInstance || instance.floating) && !_mousedownEvent) {
          isClickOutside = true;
        }

        if (
          instance.floating &&
          (instance.floating.anchor === target ||
            instance.floating.anchor.contains(target))
        ) {
          return;
        }
      }

      if (isClickOutside) {
        instance.hide({ event });
        if (constructor[PRIVATE_OPTION_CANCEL_ON_HIDE]) {
          _emit(CANCEL, { event });
        }
      }

      instance._mousedownEvent = null;
    });
  };

  var toggleLightDismiss = (instance, s) => {
    if (s) {
      if (
        instance.opts[OPTION_LIGHT_DISMISS] === AUTO
          ? instance.opts[MODAL]
          : instance.opts[OPTION_LIGHT_DISMISS]
      ) {
        addLightDismiss(instance);
      }
    } else {
      instance._off("*", EVENT_SUFFIX_LIGHT_DISMISS);
      instance._mousedownEvent = null;
    }
  };

  var addAriaTargets = (instance) => {
    const { base, opts } = instance;

    for (const name of [ARIA_LABELLEDBY, ARIA_DESCRIBEDBY]) {
      const suffix = ARIA_SUFFIX[name];
      let elem = opts[suffix];
      if (isString(elem)) {
        elem = getOptionElem(instance, elem, base);
      }
      if (!isElement(elem)) {
        elem = null;
      }

      instance[suffix] = elem;
      if (!elem) return;
      const id = elem ? (elem.id ||= uuidGenerator()) : elem;
      setAttribute(base, name, id);
    }
  };

  var addFrameState = (instance, s) => {
    if (s) {
      instance._isOpening = true;
      requestAnimationFrame(() => (instance._isOpening = false));
    } else {
      instance._isClosing = true;
      requestAnimationFrame(() => (instance._isClosing = false));
    }
  };

  const COLLAPSE = "collapse";

  class Collapse extends ToggleMixin(Base, COLLAPSE) {
    static Default = {
      ...DEFAULT_OPTIONS,
      eventPrefix: getEventsPrefix(COLLAPSE),
      [OPTION_HASH_NAVIGATION]: false,
      [OPTION_AUTODESTROY]: false,
      [TOGGLER]: ({ id }) => getDefaultToggleSelector(id, true),
      [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [COLLAPSE + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    };

    constructor(elem, opts) {
      super(elem, opts);
    }
    init() {
      if (this.isInit) return;

      this.base.id = this.id;

      this._emit(EVENT_BEFORE_INIT);

      this._update();

      this.opts[OPTION_HASH_NAVIGATION] && addHashNavigation(this);
      this.opts[DISMISS] && addDismiss(this);

      return callShowInit(this);
    }
    _update() {
      const { base, opts } = this;

      if (opts[STATE_MODE] === HIDDEN && base[HIDDEN] === UNTIL_FOUND) {
        opts[STATE_MODE] = MODE_HIDDEN_UNTIL_FOUND;
      }

      updateOptsByData(
        opts,
        base,
        [TRANSITION, STATE_MODE, OPTION_HASH_NAVIGATION, OPTION_AUTODESTROY],
        [OPTION_HASH_NAVIGATION, OPTION_AUTODESTROY],
      );

      this.teleport = Teleport.createOrUpdate(
        this.teleport,
        base,
        opts.teleport,
      )?.move(this);

      if (opts[STATE_MODE] === ACTION_REMOVE && base[HIDDEN]) {
        toggleStateMode(false, this);
      }

      this.transition = Transition.createOrUpdate(
        this.transition,
        base,
        opts.transition,
        { cssVariables: true },
      );

      this.updateTriggers();
    }
    destroy(destroyOpts) {
      // eslint-disable-next-line prefer-const
      let { opts, togglers, base } = this;

      if (!this.isInit) return;

      this._emit(EVENT_BEFORE_DESTROY);

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

      opts.a11y && removeAttribute(togglers, ARIA_CONTROLS, ARIA_EXPANDED, ROLE);
      removeClass(base, opts[COLLAPSE + CLASS_ACTIVE_SUFFIX]);

      baseDestroy(this, destroyOpts);

      return this;
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
                toggler[ROLE] = BUTTON;
              }
            }
            toggleClass(
              toggler,
              opts[TOGGLER + CLASS_ACTIVE_SUFFIX],
              !!this.isOpen,
            );
            this._on(toggler, EVENT_CLICK, (event) => {
              event.preventDefault();
              this.toggle(null, { trigger: toggler, event });
            });
          }
          return toggler;
        },
      ));
    }
    async toggle(s, params) {
      const { base, togglers, opts, _emit, isOpen, isAnimating } = this;
      const { awaitAnimation, a11y } = opts;
      const { animated, silent, trigger, event } =
        normalizeToggleParameters(params);

      s ??= !isOpen;

      if ((awaitAnimation && isAnimating) || s === isOpen) return;

      this.isOpen = s;

      if (isAnimating && !awaitAnimation) {
        await this.transition.cancel();
      }

      const eventParams = { trigger, event };

      !silent && _emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

      s && toggleStateMode(true, this);

      !silent && _emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

      const promise = this.transition?.run(s, animated);

      a11y && setAttribute(togglers, ARIA_EXPANDED, !!s);
      toggleClass(togglers, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);
      toggleClass(base, opts[COLLAPSE + CLASS_ACTIVE_SUFFIX], s);

      awaitPromise(promise, () => {
        !s && toggleStateMode(false, this);
        !silent && _emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
        if (!s && opts[OPTION_AUTODESTROY]) {
          opts[OPTION_AUTODESTROY] && this.destroy({ remove: true });
        }
      });

      animated && awaitAnimation && (await promise);

      return this;
    }
  }

  const DIRECTIONS = {
    [KEY_ARROW_LEFT]: LEFT,
    [KEY_ARROW_UP]: UP,
    [KEY_ARROW_RIGHT]: RIGHT,
    [KEY_ARROW_DOWN]: DOWN,
    x: [LEFT, RIGHT],
    y: [UP, DOWN],
  };

  class Dropdown extends ToggleMixin(Base, DROPDOWN) {
    static Default = {
      ...DEFAULT_OPTIONS,
      ...DEFAULT_FLOATING_OPTIONS,
      eventPrefix: getEventsPrefix(DROPDOWN),
      itemClickHide: true,
      arrowActivation: "y",
      autofocus: false,
      items: getDataSelector(DROPDOWN + "-" + ITEM),
      trigger: CLICK,
      [TOGGLER]: null,
      [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [DROPDOWN + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [OPTION_PREVENT_SCROLL]: AUTO,
    };

    constructor(elem, opts) {
      super(elem, opts);
    }
    init() {
      if (this.isInit) return;

      const { base, show, _on, opts } = this;

      base.id = this.id;

      this.teleport = new Teleport(base, { disableAttributes: true });

      this._update();

      _on(base, EVENT_KEYDOWN, this._onKeydown.bind(this));
      _on(this.toggler, EVENT_KEYDOWN, async (event) => {
        let arrowActivation = opts.arrowActivation;
        const { keyCode } = event;

        if (DIRECTIONS[arrowActivation]) {
          arrowActivation = DIRECTIONS[arrowActivation];
        }

        const arrowActivated = arrowActivation.includes(DIRECTIONS[keyCode]);

        if (arrowActivated) {
          event.preventDefault();
          if (!this.isOpen) {
            await show({ event, trigger: this.toggler });
          }
          if (this.isAnimating && !this.isOpen) return;
          this.focusableElems
            .at(keyCode === KEY_ARROW_UP || keyCode === KEY_ARROW_LEFT ? -1 : 0)
            ?.focus();
        }
      });

      opts[DISMISS] && addDismiss(this);

      return callShowInit(this);
    }
    _update() {
      const { base, opts, _on, _off, hide } = this;
      updateOptsByData(
        opts,
        base,
        [TRANSITION, STATE_MODE, TRIGGER, ...TOP_LAYER_OPTIONS_NAMES],
        TOP_LAYER_OPTIONS_NAMES,
      );

      this.transition = Transition.createOrUpdate(
        this.transition,
        base,
        opts.transition,
      );

      this.teleport.opts.to = opts.moveToRoot ? body : null;

      this.updateToggler();

      if (opts.itemClickHide) {
        _on(base, EVENT_CLICK, async (event) => {
          const trigger = closest(event.target, this.focusableElems);
          if (
            !trigger ||
            (opts.itemClickHide !== true &&
              (isFunction(opts.itemClickHide)
                ? await !opts.itemClickHide(this, {
                    trigger,
                    event,
                  })
                : !is(trigger, opts.itemClickHide)))
          )
            return;
          hide({ event, trigger });
        });
      } else {
        _off(base, EVENT_CLICK);
      }

      addPopoverAttribute(this);
      toggleOnInterection(this);

      addStatusClasses(this, MODAL, OPTION_TOP_LAYER, OPTION_PREVENT_SCROLL);
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
      const isControl = [
        KEY_ENTER,
        KEY_SPACE,
        KEY_END,
        KEY_HOME,
        KEY_ARROW_LEFT,
        KEY_ARROW_UP,
        KEY_ARROW_RIGHT,
        KEY_ARROW_DOWN,
      ].includes(event.keyCode);
      const { focusableElems, opts } = this;

      if (!isControl && event.keyCode !== KEY_TAB) {
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

      const nextIndex = currentIndex + 1 > lastIndex ? 0 : currentIndex + 1;
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : lastIndex;

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
          // hide({ event, trigger: event.target });
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
      const { opts, toggler, base } = this;
      this.emit(EVENT_BEFORE_DESTROY);
      opts.a11y && removeAttribute(toggler, ARIA_CONTROLS, ARIA_EXPANDED);
      removeClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX]);
      removeClass(base, opts[DROPDOWN + CLASS_ACTIVE_SUFFIX]);
      togglePreventScroll(this, false);
      destroyTopLayer(base);
      return baseDestroy(this, destroyOpts);
    }

    async toggle(s, params) {
      const { isOpen, isAnimating, toggler, base, opts, _emit } = this;
      const { awaitAnimation, a11y } = opts;
      const { animated, silent, trigger, event } =
        normalizeToggleParameters(params);

      s ??= !isOpen;

      if ((awaitAnimation && isAnimating) || s === isOpen) return;

      this.isOpen = s;

      if (checkFloatings(this, s)) return;

      if (isAnimating && !awaitAnimation) {
        await this.transition.cancel();
      }

      const eventParams = { event, trigger };

      !silent && _emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

      a11y && (toggler[ARIA_EXPANDED] = !!s);

      const promise = floatingTransition(this, {
        s,
        animated,
        silent,
        eventParams,
      });

      toggleClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);
      toggleClass(base, opts[DROPDOWN + CLASS_ACTIVE_SUFFIX], s);

      animated && awaitAnimation && (await promise);

      return this;
    }
  }

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
      const progress = +Math.max(time / opts.duration, 0).toFixed(3);
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

  class Dialog extends ToggleMixin(Base, DIALOG) {
    static [PRIVATE_OPTION_CANCEL_ON_HIDE] = true;
    static DefaultGroup = {
      name: "",
      awaitPrevious: true,
      hidePrevious: true,
    };
    static DefaultAutohide = {
      pauseOnMouseEnter: false,
      resetOnMouseEnter: false,
      pauseOnFocusEnter: false,
      resetOnFocusEnter: false,
    };
    static Default = {
      ...DEFAULT_OPTIONS,
      ...TOP_LAYER_OPTIONS,
      [MODAL]: true,
      [OPTION_LIGHT_DISMISS]: AUTO,
      [OPTION_BACK_DISMISS]: AUTO,
      eventPrefix: getEventsPrefix(DIALOG),
      [OPTION_HASH_NAVIGATION]: false,
      returnFocus: true,
      preventHide: false,
      [OPTION_PREVENT_DISMISS]: false,
      [OPTION_PREVENT_SCROLL]: AUTO,
      confirm: `[${DATA_UI_PREFIX + CONFIRM}],[${
      DATA_UI_PREFIX + CONFIRM
    }="${DIALOG}"]`,
      title: getDataSelector(DIALOG, ARIA_SUFFIX[ARIA_LABELLEDBY]),
      description: getDataSelector(DIALOG, ARIA_SUFFIX[ARIA_DESCRIBEDBY]),
      group: "",
      [CONTENT]: getDataSelector(DIALOG, CONTENT),
      [BACKDROP]: getDataSelector(DIALOG, BACKDROP),
      [TOGGLER]: true,
      [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [DIALOG + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [CONTENT + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [BACKDROP + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [OPTION_AUTODESTROY]: false,
      autohide: false,
      autofocus: true,
      focusTrap: AUTO,
      moveToRoot: true,
    };

    get main() {
      return this[CONTENT] || this.base;
    }

    constructor(elem, opts) {
      super(elem, opts);
    }

    init() {
      const { opts, isInit, _on, _emit, base, toggle } = this;

      if (isInit) return;

      base.id = this.id;

      _emit(EVENT_BEFORE_INIT);

      this._update();

      _on(document, EVENT_CLICK + UI_EVENT_PREFIX, (event) => {
        if (this._isClosing) return;
        const togglers = this._togglers;
        const trigger = isString(togglers)
          ? event.target.closest(togglers)
          : closest(event.target, togglers);
        if (trigger) {
          event.preventDefault();
          toggle(null, { trigger, event });
        }
      });

      if (opts.a11y && !isDialog(base)) {
        base.setAttribute(TABINDEX, -1);
        base[ROLE] = DIALOG;
      }

      opts[CONFIRM] && toggleConfirm(this);
      opts[OPTION_HASH_NAVIGATION] && addHashNavigation(this);
      opts[DISMISS] && addDismiss(this);

      return callShowInit(this);
    }
    _update() {
      const { base, opts, id } = this;
      updateOptsByData(
        opts,
        base,
        [
          TRANSITION,
          STATE_MODE,
          BACKDROP,
          OPTION_GROUP,
          OPTION_AUTODESTROY,
          OPTION_HASH_NAVIGATION,
          ...TOP_LAYER_OPTIONS_NAMES,
        ],
        [OPTION_HASH_NAVIGATION, OPTION_AUTODESTROY, ...TOP_LAYER_OPTIONS_NAMES],
      );
      updateModule(this, OPTION_GROUP, NAME);
      updateModule(this, AUTOHIDE, DURATION);

      let backdrop;
      if (isString(opts[BACKDROP])) {
        backdrop = (opts[BACKDROP][0] === "#" ? doc : base).querySelector(
          opts[BACKDROP],
        );
      }

      opts.a11y && addAriaTargets(this);

      this[BACKDROP] = backdrop;

      this[CONTENT] = getOptionElem(this, opts[CONTENT], base);

      this.teleport = Teleport.createOrUpdate(
        this.teleport,
        base,
        opts.moveToRoot ? opts.root : false,
        {
          disableAttributes: true,
        },
      )?.move(this);

      if (opts[STATE_MODE] === ACTION_REMOVE && base[HIDDEN]) {
        toggleStateMode(false, this);
      }

      this.transition = Transition.createOrUpdate(
        this.transition,
        this.main,
        opts.transition,
      );
      this.autohide = Autoaction.createOrUpdate(
        this.autohide,
        this.main,
        this.hide,
        opts.autohide,
      );

      this._togglers =
        opts.toggler === true ? getDefaultToggleSelector(id) : opts.toggler;

      addPopoverAttribute(this);
      addStatusClasses(
        this,
        BACKDROP,
        MODAL,
        OPTION_TOP_LAYER,
        OPTION_PREVENT_SCROLL,
      );
    }
    destroy(destroyOpts) {
      if (!this.isInit) return;

      const { base, opts } = this;

      removeClass(this._togglers, opts[TOGGLER + CLASS_ACTIVE_SUFFIX]);
      [DIALOG, CONTENT, BACKDROP].forEach((name) =>
        removeClass(this[name], opts[name + CLASS_ACTIVE_SUFFIX]),
      );

      this.focusGuards?.destroy();
      this.focusGuards = null;
      this.placeholder?.replaceWith(base);

      this.isOpen = false;

      destroyTopLayer(base);

      togglePreventScroll(this, false);

      opts.a11y &&
        removeAttribute(base, TABINDEX, ROLE, ARIA_LABELLEDBY, ARIA_DESCRIBEDBY);

      baseDestroy(this, destroyOpts);
      return this;
    }

    async toggle(s, params) {
      const { opts, isOpen, _emit, isAnimating, backdrop, base, autohide } = this;

      let optReturnFocusAwait =
        opts.returnFocus && (opts.returnFocus?.await ?? opts.group.awaitPrevious);

      const { animated, silent, trigger, event, __initial } =
        normalizeToggleParameters(params);

      s = !!(s ?? !isOpen);

      if (!s) {
        if (opts[OPTION_PREVENT_DISMISS] && event.type === EVENT_CLOSE) {
          animateClass(
            this.main,
            camelToKebab(UI_PREFIX + EVENT_DISMISS_PREVENTED),
          );
          _emit(EVENT_DISMISS_PREVENTED, { event });
          toggleBackDismiss(true, this);
          return;
        }
      }

      if ((opts.awaitAnimation && isAnimating) || s === isOpen) return;

      let groupClosingFinish;
      if (!s && opts.group) {
        this.groupClosing = new Promise((resolve) => {
          groupClosingFinish = resolve;
        });
      }

      if (isAnimating && !opts.awaitAnimation) {
        await this.transition?.cancel();
      }

      const eventParams = { trigger, event };

      !silent && _emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

      if (
        !s &&
        opts.preventHide &&
        (isFunction(opts.preventHide)
          ? !(await opts.preventHide(this, eventParams))
          : opts.preventHide)
      ) {
        this.groupClosing = false;
        animateClass(this.main, camelToKebab(UI_PREFIX + EVENT_HIDE_PREVENTED));
        return _emit(EVENT_HIDE_PREVENTED, eventParams);
      }

      addFrameState(this, s);

      this.isOpen = s;

      const backdropIsOpen = arrayFrom(this.instances.values()).find(
        (instance) =>
          instance !== this && instance.isOpen && instance[BACKDROP] === backdrop,
      );

      const openGroupDialogs = this.groupDialogs.filter(
        ({ isOpen, opts }) => opts.group && isOpen,
      );
      if (s) {
        if (openGroupDialogs.length > 1) {
          const promises = Promise.allSettled(
            openGroupDialogs
              .filter((m) => m !== this)
              .map((instance) => {
                !instance.groupClosing && instance.hide();
                return instance.groupClosing;
              }),
          );
          if (opts.group.awaitPrevious) {
            await promises;
          }
        }
      } else if (!s && !openGroupDialogs.length) {
        optReturnFocusAwait = false;
      }

      s && toggleStateMode(true, this);

      !silent && _emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

      const promise = this.transition?.run(s, animated);

      !animated && this._toggleClasses(s, backdropIsOpen);

      const focusTrap = opts.focusTrap === AUTO ? opts[MODAL] : opts.focusTrap;

      if (s) {
        if (opts.returnFocus) {
          this.returnFocusElem ||= doc.activeElement;
        }
        toggleTopLayer(this, true);
        togglePreventScroll(this, true);
        if (focusTrap && !isModal(base)) {
          this.focusGuards = new FocusGuards(base);
        }
      } else if (!optReturnFocusAwait) {
        this.returnFocus();
      }

      animated && this._toggleClasses(s, backdropIsOpen);

      if (__initial && !animated && backdrop) {
        resetTransition(backdrop);
      }

      if (s) {
        (opts.autofocus || focusTrap) && callAutofocus(this);
      } else {
        this.returnFocusElem = null;
      }

      toggleBackDismiss(s, this);

      s && autohide && autohide.toggleInterections(true);

      toggleLightDismiss(this, s);

      awaitPromise(promise, () => {
        if (!s) {
          if (optReturnFocusAwait) {
            this.returnFocus();
          }
          toggleTopLayer(this, false);
          toggleStateMode(false, this);
          togglePreventScroll(this, false);
          autohide && autohide.toggleInterections(false);
          this.focusGuards?.destroy();
          this.focusGuards = null;
        }

        !silent && _emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);

        if (!s) {
          opts[OPTION_AUTODESTROY] && this.destroy({ remove: true });
          this.groupClosing = false;
          groupClosingFinish?.();
        }
      });

      animated && opts.awaitAnimation && (await promise);

      return this;
    }
    _toggleClasses(s, backdropIsOpen) {
      const { opts, base, content, backdrop } = this;
      toggleClass(
        getElements(this._togglers),
        opts[TOGGLER + CLASS_ACTIVE_SUFFIX],
        s,
      );
      toggleClass(base, opts[DIALOG + CLASS_ACTIVE_SUFFIX], s);
      toggleClass(content, opts[CONTENT + CLASS_ACTIVE_SUFFIX], s);
      if (!backdropIsOpen) {
        toggleClass(backdrop, opts[BACKDROP + CLASS_ACTIVE_SUFFIX], s);
      }
    }
    returnFocus() {
      if (this.opts.returnFocus) {
        focus(this.returnFocusElem);
      }
    }

    get groupDialogs() {
      return arrayFrom(this.instances.values()).filter(
        ({ opts }) => opts.group?.name === this.opts.group?.name,
      );
    }
  }

  const TABLIST = "tablist";
  const TAB = "tab";
  const TABS = "tabs";
  const TABPANEL = "tabpanel";
  const ACCORDION = "accordion";

  const OPTION_TAB_ROLE = TAB + ROLE_SUFFIX;
  const OPTION_TABPANEL_ROLE = TABPANEL + ROLE_SUFFIX;
  const OPTION_TABPANEL_TABINDEX = TABPANEL + upperFirst(TABINDEX);
  const OPTION_STATE_ATTRIBUTE = "stateAttribute";
  const OPTION_ALWAYS_EXPANDED = "alwaysExpanded";
  const OPTION_MULTI_EXPAND = "multiExpand";

  const ACTION_INIT_TAB = "initTab";
  const ACTION_DESTROY_TAB = "destroyTab";

  const TABLIST_SECONDARY_METHODS = [
    "getTab",
    "isTab",
    ACTION_INIT_TAB,
    "initTabs",
  ];

  const DEFAULT_ACCORDION_OPTIONS = {
    [OPTION_ALWAYS_EXPANDED]: false,
    [HORIZONTAL]: false,
    arrowActivation: false,
    awaitPrevious: false,
    a11y: ACCORDION,
  };

  const A11Y_DEFAULTS$1 = {
    [ACCORDION]: {
      [ROLE]: null,
      [OPTION_TAB_ROLE]: BUTTON,
      [OPTION_TABPANEL_ROLE]: REGION,
      [ARIA_ORIENTATION]: false,
      [OPTION_STATE_ATTRIBUTE]: ARIA_EXPANDED,
      [TABINDEX]: false,
      [OPTION_TABPANEL_TABINDEX]: false,
    },
    [TABS]: {
      [ROLE]: TABLIST,
      [OPTION_TAB_ROLE]: TAB,
      [OPTION_TABPANEL_ROLE]: TABPANEL,
      [ARIA_ORIENTATION]: true,
      [OPTION_STATE_ATTRIBUTE]: ARIA_SELECTED,
      [TABINDEX]: true,
      [OPTION_TABPANEL_TABINDEX]: true,
    },
  };

  class Tablist extends Base {
    static DefaultA11y = { ...A11Y_DEFAULTS$1[ACCORDION] };
    static Default = {
      ...DEFAULT_OPTIONS,
      eventPrefix: getEventsPrefix(TABLIST),
      siblings: true,
      [OPTION_MULTI_EXPAND]: false,
      keyboard: true,
      [OPTION_HASH_NAVIGATION]: true,
      rtl: false,
      focusFilter: null,
      dismiss: false,
      [TAB]: getDataSelector(TABLIST, TAB),
      [TABPANEL]: getDataSelector(TABLIST, TABPANEL),
      [TAB + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [TABPANEL + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      ...DEFAULT_ACCORDION_OPTIONS,
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
      const { base, tabs, lastShownTab, opts } = this;
      const { a11y } = updateModule(this, A11Y, false, A11Y_DEFAULTS$1);

      updateOptsByData(
        opts,
        base,
        [
          TRANSITION,
          STATE_MODE,
          OPTION_HASH_NAVIGATION,
          OPTION_ALWAYS_EXPANDED,
          OPTION_MULTI_EXPAND,
          HORIZONTAL,
        ],
        [
          OPTION_HASH_NAVIGATION,
          OPTION_ALWAYS_EXPANDED,
          OPTION_MULTI_EXPAND,
          HORIZONTAL,
        ],
      );

      if (a11y) {
        base[ROLE] = a11y[ROLE];
        a11y[ARIA_ORIENTATION] &&
          (base[ARIA_ORIENTATION] = opts[HORIZONTAL] ? HORIZONTAL : VERTICAL);
      }

      const shown = lastShownTab?.index ?? opts.shown;

      const tabWithState = tabs.map((tabObj, i) => {
        const { tab, tabpanel, teleport } = tabObj;

        if (a11y) {
          removeAttribute(tab, ARIA_SELECTED, ARIA_EXPANDED);
          setAttribute(tab, ARIA_CONTROLS, tabpanel.id);
          tab[ROLE] = a11y[OPTION_TAB_ROLE];
          if (!/BUTTON|A/.test(tab.nodeName) && !tab.hasAttribute(TABINDEX)) {
            tab.setAttribute(TABINDEX, 0);
          }
          tabpanel[ROLE] = a11y[OPTION_TABPANEL_ROLE];
          setAttribute(tabpanel, ARIA_LABELLEDBY, tab.id);
        }

        tabObj.teleport = Teleport.createOrUpdate(
          teleport,
          tabpanel,
          opts.teleport,
        )?.move(this, tabObj);

        let isOpenTabpanel;
        if (isFunction(shown)) {
          isOpenTabpanel = shown(tabObj);
        } else if (isArray(shown)) {
          isOpenTabpanel = shown.some((val) => val === i || val === tabpanel.id);
        } else if (shown !== null) {
          isOpenTabpanel = tabpanel.id === shown || i === shown;
        } else {
          isOpenTabpanel = isShown(tabpanel, opts.stateMode);
        }

        return [isOpenTabpanel, tabObj];
      });
      const hasSelected = tabWithState.find(([isOpen]) => isOpen);
      if (opts[OPTION_ALWAYS_EXPANDED] && !hasSelected) {
        tabWithState[0][0] = true;
      }
      tabWithState.forEach(([isOpen, tabInstance]) => {
        tabInstance.transition = Transition.createOrUpdate(
          tabInstance.transition,
          tabInstance[TABPANEL],
          opts.transition,
          { cssVariables: true },
        );
        tabInstance.toggle(isOpen, {
          animated:
            getBooleanDataAttrValue(tabInstance[TABPANEL], APPEAR) ?? opts.appear,
          silent: !isOpen,
        });
      });
    }
    init() {
      const { isInit, _emit } = this;
      if (isInit) return;

      this.base.id = this.id;

      TABLIST_SECONDARY_METHODS.forEach(
        (name) => (this[name] = this[name].bind(this)),
      );

      _emit(EVENT_BEFORE_INIT);

      this.tabs = [];
      this.initTabs();

      this._updateTabIndex();

      this._update();

      this.instances.set(this.id, this);
      this.isInit = true;
      toggleInitClass(this, true);
      return _emit(EVENT_INIT);
    }

    destroy({ keepInstance = false, keepState = false } = {}) {
      const {
        tablist,
        tabs,
        opts: { a11y },
        isInit,
        off,
        _emit,
      } = this;

      if (!isInit) return;

      _emit(EVENT_BEFORE_DESTROY);

      off(tabs);

      if (a11y) {
        removeAttribute(
          tablist,
          a11y[ROLE] && ROLE,
          a11y[ARIA_ORIENTATION] && ARIA_ORIENTATION,
        );
      }

      tabs.forEach((tab) => tab.destroy({ keepState }));

      if (!keepInstance) {
        destroyInstance(this);
      }

      toggleInitClass(this, false);

      this.isInit = false;

      _emit(EVENT_DESTROY);

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

      const { tabs, tablist, opts, shownTabs, _on, _off, _emit } = this;
      const index = tabs.length;

      const tabpanelId = tab.getAttribute(DATA_UI_PREFIX + TABLIST + "-" + TAB);

      let tabpanel;
      if (tabpanelId) {
        tabpanel = doc.getElementById(tabpanelId);
      } else if (isString(opts[TABPANEL])) {
        if (opts.siblings) {
          tabpanel = next(tab, opts[TABPANEL]);
        }
      } else if (isIterable(opts[TABPANEL])) {
        tabpanel = opts[TABPANEL][index];
      } else if (isFunction(opts[TABPANEL])) {
        tabpanel = opts[TABPANEL]({ tablist, tab, index });
      }

      if (!tabpanel) return;

      if (opts[STATE_MODE] === HIDDEN && tabpanel[HIDDEN] === UNTIL_FOUND) {
        opts[STATE_MODE] = MODE_HIDDEN_UNTIL_FOUND;
      }

      const uuid = uuidGenerator();
      const id = (tabpanel.id ||= uuid);
      tab.id ||= uuid;

      let isOpen;
      if (shownTabs.length && !opts[OPTION_MULTI_EXPAND]) {
        isOpen = false;
      }
      if (opts.hashNavigation && checkHash(id)) {
        isOpen = true;
      }

      let isMouseDown;
      _on(tab, EVENT_FOCUS, (e) => {
        !isMouseDown && this._onTabFocus(e);
      });
      _on(tab, EVENT_KEYDOWN, (e) => this._onTabKeydown(e));
      _on(tab, EVENT_MOUSEDOWN, () => {
        isMouseDown = true;
        requestAnimationFrame(() => (isMouseDown = false));
      });
      _on(tab, EVENT_CLICK, (event) => {
        event.preventDefault();
        this.toggle(tab, null, { event, trigger: tab });
      });

      const destroy = ({
        cleanStyles = true,
        remove = false,
        keepState = false,
      } = {}) => {
        const opts = this.opts;
        const a11y = opts.a11y;
        if (a11y) {
          removeAttribute(
            tab,
            ROLE,
            TABINDEX,
            ARIA_CONTROLS,
            ARIA_EXPANDED,
            a11y[OPTION_STATE_ATTRIBUTE],
          );
          removeAttribute(
            tabpanel,
            ROLE,
            a11y[OPTION_TABPANEL_TABINDEX] && TABINDEX,
            ARIA_LABELLEDBY,
            a11y[ARIA_HIDDEN] && ARIA_HIDDEN,
            HIDDEN,
            INERT,
          );
        }

        _off(elems);
        this.tabs = without(this.tabs, tabInstance);
        if (cleanStyles) {
          removeClass(tab, opts[TAB + CLASS_ACTIVE_SUFFIX]);
          removeClass(tabpanel, opts[TABPANEL + CLASS_ACTIVE_SUFFIX]);
          tabInstance.transition?.destroy();
          tabInstance.teleport?.destroy();
        }

        elems.forEach((elem) => {
          if (!elem) return;

          remove && elem.remove();

          if (!keepState) {
            removeClass(elem, [HIDDEN_CLASS, SHOWN_CLASS]);
            removeAttribute(elem, HIDDEN, INERT);
          }
        });

        _emit(ACTION_DESTROY_TAB, tabInstance);
      };

      const toggleDisabled = (s = null) => {
        const disabled = tab.toggleAttribute(DISABLED, s);

        disabled && tabInstance.hide(false);

        if (this.opts[OPTION_ALWAYS_EXPANDED]) {
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

      const elems = [tab, tabpanel];
      const tabInstance = {
        id,
        uuid,
        tab,
        tabpanel,
        elems,
        index,
        transition: opts.transition
          ? new Transition(tabpanel, opts.transition)
          : undefined,
        destroy: destroy.bind(this),
        toggleDisabled: toggleDisabled.bind(this),
        isOpen,
        get isDisabled() {
          return tab.hasAttribute(DISABLED);
        },
        get initialPlaceNode() {
          return (
            tabInstance.teleport?.placeholder ??
            tabInstance.placeholder ??
            tabpanel
          );
        },
      };

      [ACTION_HIDE, ACTION_SHOW, ACTION_TOGGLE].forEach(
        (action) => (tabInstance[action] = this[action].bind(this, tabInstance)),
      );
      tabInstance.is = this.isTab.bind(this, tabInstance);

      opts[DISMISS] && addDismiss(this, tabpanel, tabInstance.hide);

      if (opts[STATE_MODE] === ACTION_REMOVE && tabpanel[HIDDEN]) {
        toggleStateMode(false, this, tabpanel, tabInstance);
      }

      tabs.push(tabInstance);

      _emit(ACTION_INIT_TAB, tabInstance);

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

      this.opts.arrowActivation && !tabInstance.isOpen && tabInstance.show();

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
      return this.tabs.filter(({ isOpen }) => isOpen);
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

      const { opts, shownTabs, _emit } = this;
      const { a11y, awaitAnimation } = opts;
      const { tab, isOpen, transition, index, tabpanel } = tabInstance;

      s = !!(s ?? !isOpen);

      s && this._updateTabIndex(index);

      if (
        s === isOpen ||
        (awaitAnimation &&
          transition?.isAnimating &&
          ((shownTabs.length <= 1 && !opts[OPTION_MULTI_EXPAND]) ||
            opts[OPTION_MULTI_EXPAND])) ||
        (isOpen && opts[OPTION_ALWAYS_EXPANDED] && !s && shownTabs.length < 2) ||
        (s && !this.focusFilter(tabInstance))
      )
        return;

      if (transition?.isAnimating && !awaitAnimation) {
        await transition.cancel();
      }

      const eventParams = { event, trigger };

      !silent &&
        _emit(
          s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE,
          tabInstance,
          eventParams,
        );

      tabInstance.isOpen = s;

      if (!opts[OPTION_MULTI_EXPAND] && s) {
        const animatedOrShownTabs = this.tabs.filter(
          (tab) =>
            tab !== tabInstance && (tab.transition?.isAnimating || tab.isOpen),
        );
        for (const tab of animatedOrShownTabs) {
          if (tab.isOpen && tab.transition?.isAnimating) {
            tab.hide(false);
            tab.transition.cancel();
            continue;
          }
          tab.hide(animated);
          if (opts.awaitPrevious) {
            await tab.transition?.getAwaitPromise();
          }
        }
        if (s !== tabInstance.isOpen) return;
      }

      s && toggleStateMode(true, this, tabpanel, tabInstance);

      !silent && _emit(s ? EVENT_SHOW : EVENT_HIDE, tabInstance, eventParams);

      const promise = transition?.run(s, animated);

      toggleClass(tab, opts[TAB + CLASS_ACTIVE_SUFFIX], s);
      toggleClass(tabpanel, opts[TABPANEL + CLASS_ACTIVE_SUFFIX], s);

      if (a11y) {
        a11y[OPTION_STATE_ATTRIBUTE] &&
          setAttribute(tab, a11y[OPTION_STATE_ATTRIBUTE], !!s);
      }

      if (s) {
        this.lastShownTab = tabInstance;
        this.currentTabIndex ??= index;
      }

      awaitPromise(promise, () => {
        !s && toggleStateMode(false, this, tabpanel, tabInstance);
        !silent &&
          _emit(s ? EVENT_SHOWN : EVENT_HIDDEN, tabInstance, eventParams);
      });

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
    [OPTION_ALWAYS_EXPANDED]: true,
    horizontal: true,
    arrowActivation: true,
    awaitPrevious: true,
    a11y: TABS,
  });

  Tablist.data(UI_PREFIX + ACCORDION, DEFAULT_ACCORDION_OPTIONS);

  const TOAST = "toast";

  const positions = {};
  const wrappers = new Map();
  const _containers = {};

  const A11Y_DEFAULTS = {
    [STATUS]: {
      [ROLE]: STATUS,
      [ARIA_LIVE]: "polite",
    },
    [ALERT]: {
      [ROLE]: ALERT,
      [ARIA_LIVE]: "assertive",
    },
  };

  class Toast extends ToggleMixin(Base, TOAST) {
    static _templates = {};
    static DefaultA11y = { ...A11Y_DEFAULTS[STATUS] };
    static Default = {
      ...DEFAULT_OPTIONS,
      shown: true,
      eventPrefix: getEventsPrefix(TOAST),
      root: null,
      container: "",
      template: "",
      appear: true,
      limit: false,
      limitAnimateEnter: true,
      limitAnimateLeave: false,
      autohide: 5000,
      topLayer: true,
      keepTopLayer: false,
      a11y: STATUS,
      position: "top-end",
      [TOAST + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    };
    constructor(elem, opts) {
      if (isObject(elem)) {
        opts = elem;
        elem = null;
      }
      super(elem, opts);
    }
    init() {
      if (this.isInit) return;

      this.base.id = this.id;

      this._update();

      this.opts[DISMISS] && addDismiss(this);

      return callShowInit(this);
    }
    _update() {
      const { opts, base, autohide, hide } = this;

      const { a11y } = updateModule(this, A11Y, false, A11Y_DEFAULTS);

      if (!opts.root && inDOM(base)) {
        this.root = base.parentElement;
      } else {
        this.root = opts.root ? getOptionElem(this, opts.root) : body;
      }
      if (opts[STATE_MODE] === ACTION_REMOVE && base[HIDDEN]) {
        toggleStateMode(false, this);
      }

      this.transition = Transition.createOrUpdate(
        this.transition,
        base,
        opts.transition,
      );
      this.autohide = Autoaction.createOrUpdate(
        autohide,
        base,
        hide,
        opts.autohide,
      );

      if (a11y) {
        base[ARIA_ATOMIC] = true;
        base[ROLE] = a11y[ROLE];
        base[ARIA_LIVE] = a11y[ARIA_LIVE];
      }
    }
    destroy(destroyOpts) {
      if (!this.isInit) return;
      baseDestroy(this, { remove: true, ...destroyOpts });
      return this;
    }

    async toggle(s, params) {
      const {
        transition,
        opts,
        autohide,
        base,
        root,
        instances,
        constructor,
        _emit,
      } = this;
      const { animated, silent, event, trigger } =
        normalizeToggleParameters(params);

      const { limit, position, container, topLayer, keepTopLayer, stateMode } =
        opts;

      s ??= !isShown(base, stateMode);

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
              console.log(nots, i - (limit - 1));
              nots[i - (limit - 1)]?.hide(opts.limitAnimateLeave);
              if (!opts.limitAnimateEnter) {
                preventAnimation = true;
              }
            }
          }
        }
        if (root) {
          let to = root;
          if (position) {
            const wrapper = (to = constructor.getContainer({
              position,
              root,
              container,
              keepTopLayer,
            }));

            if (POPOVER_API_SUPPORTED && topLayer) {
              wrapper[POPOVER] = POPOVER_API_MODE_MANUAL;
            } else {
              wrapper[POPOVER] = null;
            }

            if (wrapper && wrapper.parentElement !== root) {
              root.append(wrapper);
            }
            if (POPOVER_API_SUPPORTED && topLayer) {
              wrapper.hidePopover();
              wrapper.showPopover();
            }
          }
          to.append(base);
        }
      }

      const eventParams = { event, trigger };

      !silent && _emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

      autohide && autohide.toggleInterections(s);

      s && toggleStateMode(true, this);

      !silent && _emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

      const promise = transition?.run(s, animated && !preventAnimation);

      toggleClass(base, opts[TOAST + CLASS_ACTIVE_SUFFIX], s);

      awaitPromise(promise, () => {
        !s && toggleStateMode(false, this);
        !silent && _emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
        !s && this.destroy({ remove: true });
      });

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

      this.container = wrapper;

      return this;
    }

    static getContainer({
      position,
      root = body,
      container = "",
      keepTopLayer,
      a11y,
    }) {
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

      if (a11y) {
        wrapper.setAttribute(TABINDEX, -1);
        wrapper[ROLE] = REGION;
      }

      rootWrappers.add({ wrapper, container, position, root, keepTopLayer });
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
    static forceTopLayer() {
      [...wrappers.values()].forEach((set) => {
        set.forEach(({ wrapper, root, keepTopLayer }) => {
          if (
            keepTopLayer &&
            POPOVER_API_SUPPORTED &&
            wrapper.popover &&
            root.contains(wrapper)
          ) {
            wrapper.hidePopover();
            wrapper.showPopover();
          }
        });
      });
    }
  }

  class Tooltip extends ToggleMixin(Base, TOOLTIP) {
    static Default = {
      ...DEFAULT_OPTIONS,
      ...DEFAULT_FLOATING_OPTIONS,
      delay: [150, 0],
      eventPrefix: getEventsPrefix(TOOLTIP),
      placement: TOP,
      template: (content) =>
        `<div class="${TOOLTIP}"><div class="${TOOLTIP}-${CONTENT}">${content}</div></div>`,
      interactive: false,
      removeTitle: true,
      tooltipClass: "",
      [ANCHOR + CLASS_ACTIVE_SUFFIX]: getClassActive(TOOLTIP),
      [TOOLTIP + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      trigger: HOVER + " " + FOCUS,
      content: null,
    };

    static get BASE_NODE_NAME() {
      return ANCHOR;
    }
    constructor(elem, opts) {
      super(elem, opts);
    }
    init() {
      const { opts, anchor, id, isInit, _emit } = this;

      if (isInit) return;

      anchor.id = id;

      _emit(EVENT_BEFORE_INIT);

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

      this.teleport = new Teleport(target, { disableAttributes: true });

      this._update();

      opts[DISMISS] && addDismiss(this, target);

      return callShowInit(this, target);
    }
    _update() {
      const { tooltip, base, opts, teleport } = this;

      updateOptsByData(opts, base, [
        TRANSITION,
        [TRIGGER, kebabToCamel(TOOLTIP + "-" + TRIGGER)],
      ]);

      tooltip.toggleAttribute(INERT, !opts.interactive);

      this.transition = Transition.createOrUpdate(
        this.transition,
        tooltip,
        opts.transition,
      );

      teleport.opts.to = opts.moveToRoot ? body : base;
      teleport.opts.position = opts.moveToRoot ? BEFORE + END : AFTER + END;

      addPopoverAttribute(this, tooltip);
      toggleOnInterection(this, base, tooltip);

      addStatusClasses(this, OPTION_TOP_LAYER);

      opts.a11y && setAttribute(tooltip, TOOLTIP);
    }
    destroy(destroyOpts) {
      if (this.isInit) return;
      const { anchor, tooltip, id, _cache, _emit, opts } = this;
      _emit(EVENT_BEFORE_DESTROY);
      if (opts.a11y) {
        removeAttribute(tooltip, TOOLTIP);
        setAttribute(anchor, ARIA_DESCRIBEDBY, (val) =>
          val === id + "-" + TARGET ? _cache[OPTION_ARIA_DESCRIBEDBY] : val,
        );
      }

      if (_cache[TITLE]) {
        anchor[TITLE] = _cache[TITLE];
      }
      destroyTopLayer(tooltip);
      return baseDestroy(this, destroyOpts);
    }

    async toggle(s, params) {
      const { anchor, tooltip, id, opts, _emit, _cache, isOpen, isAnimating } =
        this;
      const awaitAnimation = opts.awaitAnimation;
      let { animated, trigger, silent, event } =
        normalizeToggleParameters(params);

      s ??= !isOpen;

      if (
        (awaitAnimation && isAnimating) ||
        s === isOpen ||
        (!s && !inDOM(tooltip))
      )
        return;

      this.isOpen = s;

      if (opts.interactive && checkFloatings(this, s)) return;

      if (isAnimating && !awaitAnimation) {
        await this.transition.cancel();
      }

      const openTooltip = [...Tooltip.instances.values()].find(
        (tooltip) => tooltip.isOpen && tooltip !== this,
      );
      console.log(openTooltip);
      if (openTooltip) {
        animated = false;
        openTooltip.hide(false);
      }

      const eventParams = { event, trigger };

      !silent && _emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

      const promise = floatingTransition(this, {
        s,
        animated,
        silent,
        eventParams,
      });

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
      toggleClass(tooltip, opts[TOOLTIP + CLASS_ACTIVE_SUFFIX], s);

      animated && awaitAnimation && (await promise);

      return this;
    }
  }

  class Popover extends ToggleMixin(Base, POPOVER) {
    static [PRIVATE_OPTION_CANCEL_ON_HIDE] = true;
    static Default = {
      ...DEFAULT_OPTIONS,
      ...DEFAULT_FLOATING_OPTIONS,
      eventPrefix: getEventsPrefix(POPOVER),
      autofocus: true,
      interactive: true,
      trigger: CLICK,
      [TOGGLER]: null,
      [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      [POPOVER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
      confirm: `[${DATA_UI_PREFIX + CONFIRM}],[${
      DATA_UI_PREFIX + CONFIRM
    }="${POPOVER}"]`,
      title: getDataSelector(POPOVER, ARIA_SUFFIX[ARIA_LABELLEDBY]),
      description: getDataSelector(POPOVER, ARIA_SUFFIX[ARIA_DESCRIBEDBY]),
      [OPTION_PREVENT_SCROLL]: AUTO,
    };

    constructor(elem, opts) {
      super(elem, opts);
    }
    init() {
      if (this.isInit) return;

      const { base, opts } = this;

      base.id = this.id;

      this.teleport = new Teleport(base, { disableAttributes: true });

      this._update();

      opts[CONFIRM] && toggleConfirm(this);
      opts[DISMISS] && addDismiss(this);

      return callShowInit(this);
    }
    _update() {
      const { base, opts } = this;
      updateOptsByData(
        opts,
        base,
        [TRANSITION, STATE_MODE, TRIGGER, ...TOP_LAYER_OPTIONS_NAMES],
        TOP_LAYER_OPTIONS_NAMES,
      );

      base.toggleAttribute(INERT, !opts.interactive);

      this.transition = Transition.createOrUpdate(
        this.transition,
        base,
        opts.transition,
      );

      this.teleport.opts.to = opts.moveToRoot ? body : null;

      this.updateToggler();
      opts.a11y && addAriaTargets(this);

      addPopoverAttribute(this);
      toggleOnInterection(this);

      addStatusClasses(this, MODAL, OPTION_TOP_LAYER, OPTION_PREVENT_SCROLL);
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
      const { opts, toggler, base } = this;
      this._emit(EVENT_BEFORE_DESTROY);
      opts.a11y &&
        removeAttribute(
          toggler,
          ARIA_CONTROLS,
          ARIA_EXPANDED,
          ARIA_LABELLEDBY,
          ARIA_DESCRIBEDBY,
        );
      removeClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX]);
      removeClass(base, opts[POPOVER + CLASS_ACTIVE_SUFFIX]);
      togglePreventScroll(this, false);
      destroyTopLayer(base);
      return baseDestroy(this, destroyOpts);
    }

    async toggle(s, params) {
      const { isOpen, isAnimating, toggler, base, opts, _emit } = this;
      const { awaitAnimation, a11y } = opts;
      const { animated, silent, trigger, event } =
        normalizeToggleParameters(params);

      s ??= !isOpen;

      if (!s) {
        if (opts[OPTION_PREVENT_DISMISS] && event.type === EVENT_CLOSE) {
          animateClass(base, camelToKebab(UI_PREFIX + EVENT_DISMISS_PREVENTED));
          _emit(EVENT_DISMISS_PREVENTED, { event });
          toggleBackDismiss(true, this);
          return;
        }
      }

      if ((awaitAnimation && isAnimating) || s === isOpen) return;

      this.isOpen = s;

      if (opts.interactive && checkFloatings(this, s)) return;

      if (isAnimating && !awaitAnimation) {
        await this.transition.cancel();
      }

      const eventParams = { event, trigger };

      !silent && _emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

      a11y && (toggler[ARIA_EXPANDED] = !!s);

      const promise = floatingTransition(this, {
        s,
        animated,
        silent,
        eventParams,
      });

      toggleClass(toggler, opts[TOGGLER + CLASS_ACTIVE_SUFFIX], s);
      toggleClass(base, opts[POPOVER + CLASS_ACTIVE_SUFFIX], s);

      animated && awaitAnimation && (await promise);

      return this;
    }
  }

  exports.Collapse = Collapse;
  exports.Dialog = Dialog;
  exports.Dropdown = Dropdown;
  exports.Popover = Popover;
  exports.Tablist = Tablist;
  exports.Toast = Toast;
  exports.Tooltip = Tooltip;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=jolty.js.map
