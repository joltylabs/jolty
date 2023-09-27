import kebabToCamel from "../utils/kebabToCamel";
import upperFirst from "../utils/upperFirst";

export const UI = "ui";
export const UI_PREFIX = UI + "-";
export const UI_EVENT_PREFIX = "." + UI;
export const VAR_UI_PREFIX = "--" + UI_PREFIX;
export const PRIVATE_PREFIX = "_";
export const DATA_PREFIX = "data-";
export const DATA_UI_PREFIX = DATA_PREFIX + UI_PREFIX;
export const ACTIVE = "active";
export const CLASS_ACTIVE = UI_PREFIX + ACTIVE;

export const DEFAULT = "default";
export const NAME = "name";
export const MODE = "mode";

export const PX = "px";
export const NONE = "none";
export const ID = "id";

export const WIDTH = "width";
export const HEIGHT = "height";
export const TOP = "top";
export const LEFT = "left";
export const RIGHT = "right";
export const BOTTOM = "bottom";
export const CENTER = "center";
export const START = "start";
export const END = "end";
export const UP = "up";
export const DOWN = "down";
export const IN = "in";
export const OUT = "out";
export const MOVE = "move";
export const TITLE = "title";

export const HORIZONTAL = "horizontal";
export const VERTICAL = "vertical";
export const ABSOLUTE = "absolute";
export const FIXED = "fixed";
export const TRANSITION = "transition";
export const TELEPORT = "teleport";

export const DIV = "div";
export const BUTTON = "button";
export const WINDOW = "window";
export const DOCUMENT = "document";
export const CLASS = "class";
export const STYLE = "style";
export const KEY = "key";
export const ROLE = "role";
export const ROOT = "root";
export const CONFIRM = "confirm";
export const CANCEL = "cancel";

export const BEFORE = "before";
export const AFTER = "after";

export const MOUSE = "mouse";

export const CLICK = "click";
export const HOVER = "hover";
export const FOCUS = "focus";
export const SCROLL = "scroll";

export const HIDE = "hide";
export const HIDDEN = "hidden";
export const SHOW = "show";
export const SHOWN = "shown";
export const APPEAR = "appear";

export const TARGET = "target";
export const AVAILABLE = "awailable";
export const AVAILABLE_WIDTH = AVAILABLE + "-" + WIDTH;
export const AVAILABLE_HEIGHT = AVAILABLE + "-" + HEIGHT;
export const ANCHOR = "anchor";
export const ANCHOR_WIDTH = ANCHOR + "-" + WIDTH;
export const ANCHOR_HEIGHT = ANCHOR + "-" + HEIGHT;

export const MODAL = "modal";
export const CONTENT = "content";
export const ITEM = "item";
export const BACKDROP = "backdrop";
export const POPOVER = "popover";
export const TOOLTIP = "tooltip";
export const TOGGLER = "toggler";
export const TRIGGER = "trigger";
export const DELAY = "delay";
export const DROPDOWN = "dropdown";
export const ARROW = "arrow";
export const PROGRESS = "progress";
export const DISMISS = "dismiss";
export const FLOATING = "floating";
export const DIALOG = "dialog";

export const FLIP = "flip";
export const SHRINK = "shrink";
export const STICKY = "sticky";
export const PLACEMENT = "placement";
export const PADDING = "padding";
export const OFFSET = "offset";
export const BOUNDARY_OFFSET = "boundary-" + OFFSET;
export const WEBKIT_PREFIX = "-webkit-";
export const CLIP_PATH = "clip-path";
export const ARROW_OFFSET = ARROW + "-" + OFFSET;
export const ARROW_PADDING = ARROW + "-" + PADDING;
export const ARROW_WIDTH = ARROW + "-" + WIDTH;
export const ARROW_HEIGHT = ARROW + "-" + HEIGHT;
export const TRUE = "true";
export const FALSE = "false";

export const doc = document;
export const body = doc.body;
export const BODY = "body";

export const ENTER = "enter";
export const LEAVE = "leave";
export const BEFORE_ENTER = BEFORE + upperFirst(ENTER);
export const ENTER_ACTIVE = ENTER + upperFirst(ACTIVE);
export const ENTER_FROM = ENTER + "From";
export const ENTER_TO = ENTER + "To";
export const AFTER_ENTER = AFTER + upperFirst(ENTER);
export const BEFORE_LEAVE = BEFORE + upperFirst(LEAVE);
export const LEAVE_ACTIVE = LEAVE + upperFirst(ACTIVE);
export const LEAVE_FROM = LEAVE + "From";
export const LEAVE_TO = LEAVE + "To";
export const AFTER_LEAVE = AFTER + upperFirst(LEAVE);
export const HIDE_MODE = HIDE + upperFirst(MODE);
export const DURATION = "duration";
export const DURATION_ENTER = DURATION + upperFirst(ENTER);
export const DURATION_LEAVE = DURATION + upperFirst(LEAVE);

export const ACTION_INIT = "init";
export const ACTION_DESTROY = "destroy";
export const ACTION_TOGGLE = "toggle";
export const ACTION_SHOW = SHOW;
export const ACTION_HIDE = HIDE;
export const ACTION_ADD = "add";
export const ACTION_REMOVE = "remove";
export const ACTION_UPDATE = "update";
export const ACTION_PAUSE = "pause";
export const ACTION_RESUME = "resume";
export const ACTION_RESET = "reset";
export const ACTION_ON = "on";
export const ACTION_OFF = "off";
export const ACTION_EMIT = "emit";
export const ACTION_ONCE = "once";
export const ACTION_PREVENT = "prevent";

export const INERT = "inert";
export const AUTOFOCUS = "autofocus";
export const TABINDEX = "tabindex";
export const DISABLED = "disabled";
export const AUTO = "auto";
export const POPOVER_DATA_ATTRIBUTE = DATA_UI_PREFIX + POPOVER + "-wrapper";
export const FLOATING_DATA_ATTRIBUTE = DATA_UI_PREFIX + FLOATING;
export const DATA_PREVENT_INERT = DATA_UI_PREFIX + ACTION_PREVENT + "-" + INERT;
export const POPOVER_API_MODE_MANUAL = "manual";

export const PLACEHOLDER = "placeholder";

export const EVENT_INIT = ACTION_INIT;
export const EVENT_BEFORE_INIT = BEFORE + upperFirst(EVENT_INIT);
export const EVENT_DESTROY = ACTION_DESTROY;
export const EVENT_BEFORE_DESTROY = BEFORE + upperFirst(EVENT_DESTROY);
export const EVENT_BEFORE_SHOW = BEFORE + upperFirst(SHOW);
export const EVENT_SHOW = SHOW;
export const EVENT_SHOWN = SHOWN;
export const EVENT_BEFORE_HIDE = BEFORE + upperFirst(HIDE);
export const EVENT_HIDE = HIDE;
export const EVENT_HIDDEN = HIDDEN;
export const EVENT_PAUSE = ACTION_PAUSE;
export const EVENT_RESUME = ACTION_RESUME;
export const EVENT_RESET = ACTION_RESET;
export const EVENT_MOUSEENTER = MOUSE + ENTER;
export const EVENT_MOUSELEAVE = MOUSE + LEAVE;
export const EVENT_MOUSEMOVE = MOUSE + MOVE;
export const EVENT_MOUSEDOWN = MOUSE + DOWN;
export const EVENT_MOUSEUP = MOUSE + UP;
export const EVENT_CHANGE = "change";
export const EVENT_BREAKPOINT = "breakpoint";
export const EVENT_CLOSE = "close";
export const EVENT_CLICK = CLICK;
export const EVENT_KEYDOWN = KEY + DOWN;
export const EVENT_KEYUP = KEY + UP;
export const EVENT_FOCUS = FOCUS;
export const EVENT_FOCUSIN = FOCUS + IN;
export const EVENT_FOCUSOUT = FOCUS + OUT;
export const EVENT_RIGHT_CLICK = "contextmenu";
export const EVENT_VISIBILITY_CHANGE = "visibilitychange";
export const EVENT_HIDE_PREVENTED = "hidePrevented";
export const EVENT_ACTION_OUTSIDE = `${EVENT_CLICK}.outside ${EVENT_KEYUP}.outside`;
export const EVENT_SCROLL = SCROLL;
export const EVENT_RESIZE = "resize";
export const EVENT_DISABLED = DISABLED;
export const EVENT_ENABLED = "enabled";

export const ARIA = "aria";
export const ARIA_CONTROLS = ARIA + "-controls";
export const ARIA_EXPANDED = ARIA + "-expanded";
export const ARIA_SELECTED = ARIA + "-selected";
export const ARIA_HIDDEN = ARIA + "-" + HIDDEN;
export const ARIA_MULTISELECTABLE = ARIA + "-multiselectable";
export const ARIA_LABELLEDBY = ARIA + "-labelledby";
export const ARIA_DESCRIBEDBY = ARIA + "-describedby";
export const ARIA_ORIENTATION = ARIA + "-orientation";
export const ARIA_MODAL = ARIA + "-" + MODAL;
export const ARIA_LIVE = ARIA + "-live";
export const ARIA_ATOMIC = ARIA + "-atomic";

export const KEY_ENTER = 13;
export const KEY_ESC = 27;
export const KEY_SPACE = 32;
export const KEY_END = 35;
export const KEY_HOME = 36;
export const KEY_TAB = 9;
export const KEY_ARROW_LEFT = 37;
export const KEY_ARROW_UP = 38;
export const KEY_ARROW_RIGHT = 39;
export const KEY_ARROW_DOWN = 40;

export const A11Y = "a11y";
export const OPTION_GROUP = "group";

export const OPTION_PREVENT_SCROLL = "preventScroll";
export const OPTION_HASH_NAVIGATION = "hashNavigation";
export const POSITION = "position";
export const OPTION_ARIA_LABELLEDBY = kebabToCamel(ARIA_LABELLEDBY);
export const OPTION_ARIA_DESCRIBEDBY = kebabToCamel(ARIA_DESCRIBEDBY);
export const OPTION_ARIA_EXPANDED = kebabToCamel(ARIA_EXPANDED);
export const OPTION_ARIA_SELECTED = kebabToCamel(ARIA_SELECTED);
export const OPTION_ARIA_CONTROLS = kebabToCamel(ARIA_CONTROLS);
export const OPTION_ARIA_HIDDEN = kebabToCamel(ARIA_HIDDEN);
export const OPTION_ARIA_LIVE = kebabToCamel(ARIA_LIVE);
export const OPTION_ARIA_ATOMIC = kebabToCamel(ARIA_ATOMIC);
export const OPTION_TOP_LAYER = "topLayer";
export const OPTION_MOVE_TO_ROOT = "moveToRoot";

export const OPTION_FLOATING_CLASS = FLOATING + "Class";
export const OPTION_AUTODESTROY = AUTO + ACTION_DESTROY;
export const CLASS_ACTIVE_SUFFIX = "ClassActive";
export const ROLE_SUFFIX = upperFirst(ROLE);

export const STATUS = "status";
export const ALERT = "alert";
export const REGION = "region";

export const HIDDEN_CLASS = UI_PREFIX + HIDDEN;
export const SHOWN_CLASS = UI_PREFIX + SHOWN;
export const CLASS_SHOWN_MODE = CLASS + "-" + SHOWN;
export const CLASS_HIDDEN_MODE = CLASS + "-" + HIDDEN;
export const TRANSITION_REMOVE_MODE = { [HIDE_MODE]: ACTION_REMOVE };
export const DEFAULT_OPTIONS = {
  init: true,
  destroy: false,
  data: "",
  on: null,
  appear: null,
  eventDispatch: true,
  eventBubble: true,
  shown: null,
  a11y: true,
  hideMode: HIDDEN,
  keepPlace: true,
  transition: true,
  awaitAnimation: false,
};

export const DEFAULT_FLOATING_OPTIONS = {
  awaitAnimation: false,
  placement: BOTTOM,
  offset: 0,
  padding: 0,
  delay: 150,
  boundaryOffset: 0,
  shrink: false,
  flip: true,
  sticky: true,
  escapeHide: true,
  outsideHide: true,
  focusTrap: false,
  topLayer: true,
  root: BODY,
  moveToRoot: false,
  mode: false,
  [OPTION_FLOATING_CLASS]: "",
  shown: false,
  arrow: null,
};

export const SELECTOR_AUTOFOCUS = `[${AUTOFOCUS}]`;
export const SELECTOR_DISABLED = `[${DISABLED}]`;
export const SELECTOR_INERT = `[${INERT}]`;

export const SELECTOR_ROOT = ":" + ROOT;

export const MIRROR = {
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

export const CLIP_PATH_PROPERTY = CSS.supports(CLIP_PATH + ":" + NONE)
  ? CLIP_PATH
  : WEBKIT_PREFIX + CLIP_PATH;

export const POPOVER_API_SUPPORTED =
  HTMLElement.prototype.hasOwnProperty(POPOVER);

export const FOCUSABLE_ELEMENTS_SELECTOR = `:is(:is(a,area)[href],:is(select,textarea,button,input:not([type="hidden"])):not(disabled),details:not(:has(>summary)),iframe,:is(audio,video)[controls],[contenteditable],[tabindex]):not([inert],[inert] *,[tabindex^="-"],[${DATA_UI_PREFIX}focus-guard])`;

export const PRIVATE_OPTION_CANCEL_ON_HIDE = PRIVATE_PREFIX + "cancelOnHide";
