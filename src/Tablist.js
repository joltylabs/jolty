import {
  EVENT_INIT,
  EVENT_BEFORE_INIT,
  EVENT_DESTROY,
  EVENT_BEFORE_DESTROY,
  EVENT_BEFORE_SHOW,
  EVENT_SHOW,
  EVENT_SHOWN,
  EVENT_BEFORE_HIDE,
  EVENT_HIDE,
  EVENT_HIDDEN,
  EVENT_CLICK,
  EVENT_KEYDOWN,
  EVENT_FOCUS,
  KEY_ENTER,
  KEY_SPACE,
  KEY_END,
  KEY_HOME,
  KEY_ARROW_LEFT,
  KEY_ARROW_UP,
  KEY_ARROW_RIGHT,
  KEY_ARROW_DOWN,
  ARIA_CONTROLS,
  ARIA_LABELLEDBY,
  ARIA_HIDDEN,
  ARIA_EXPANDED,
  ARIA_SELECTED,
  ARIA_ORIENTATION,
  ROLE,
  BUTTON,
  TABINDEX,
  HIDDEN,
  INERT,
  DISABLED,
  DATA_UI_PREFIX,
  CLASS_ACTIVE,
  ACTION_HIDE,
  ACTION_SHOW,
  ACTION_TOGGLE,
  DEFAULT_OPTIONS,
  ID,
  HORIZONTAL,
  VERTICAL,
  A11Y,
  OPTION_ARIA_HIDDEN,
  CLASS_ACTIVE_SUFFIX,
  ROLE_SUFFIX,
  doc,
  UI_PREFIX,
  HIDE_MODE,
  TRANSITION,
  TELEPORT,
  ACTION_REMOVE,
  APPEAR,
  OPTION_HASH_NAVIGATION,
  ITEM,
  REGION,
  NONE,
  EVENT_MOUSEDOWN,
  HIDDEN_CLASS,
  SHOWN_CLASS,
} from "./helpers/constants";
import Base from "./helpers/Base.js";
import {
  isString,
  isElement,
  isNumber,
  isFunction,
  isArray,
  isIterable,
} from "./helpers/is";
import {
  isUnfocusable,
  callOrReturn,
  getDataSelector,
  checkHash,
  without,
  uuidGenerator,
  normalizeToggleParameters,
  getEventsPrefix,
  kebabToCamel,
  upperFirst,
  getOptionElems,
  isShown,
  getBooleanDataAttrValue,
  updateOptsByData,
  awaitPromise,
} from "./helpers/utils";
import {
  toggleClass,
  removeClass,
  removeAttribute,
  next,
  focus,
  parents,
  setAttribute,
} from "./helpers/dom";
import {
  addDismiss,
  toggleHideModeState,
  updateModule,
} from "./helpers/modules";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";

const TABLIST = "tablist";
const TAB = "tab";
const TABS = "tabs";
const TABPANEL = "tabpanel";
const ACCORDION = "accordion";

const ELEMS = [ITEM, TAB, TABPANEL];
const OPTION_TAB_ROLE = TAB + ROLE_SUFFIX;
const OPTION_TABPANEL_ROLE = TABPANEL + ROLE_SUFFIX;
const OPTION_TABPANEL_TABINDEX = TABPANEL + upperFirst(TABINDEX);
const OPTION_ARIA_ORIENTRATION = kebabToCamel(ARIA_ORIENTATION);
const OPTION_STATE_ATTRIBUTE = "stateAttribute";
const OPTION_ALWAYS_EXPANDED = "alwaysExpanded";
const OPTION_MULTI_EXPAND = "multiExpand";

const TABLIST_SECONDARY_METHODS = ["getTab", "isTab", "initTab", "initTabs"];

const DEFAULT_ACCORDION_OPTIONS = {
  [OPTION_ALWAYS_EXPANDED]: false,
  [HORIZONTAL]: false,
  arrowActivation: false,
  awaitPrevious: false,
  a11y: ACCORDION,
};

const A11Y_DEFAULTS = {
  [ACCORDION]: {
    [ROLE]: null,
    [OPTION_TAB_ROLE]: BUTTON,
    [OPTION_TABPANEL_ROLE]: REGION,
    [OPTION_ARIA_ORIENTRATION]: false,
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
    [OPTION_MULTI_EXPAND]: false,
    awaitAnimation: false,
    keyboard: true,
    [OPTION_HASH_NAVIGATION]: true,
    rtl: false,
    focusFilter: null,
    dismiss: false,
    [TAB]: getDataSelector(TABLIST, TAB),
    [TABPANEL]: getDataSelector(TABLIST, TABPANEL),
    [ITEM]: getDataSelector(TABLIST, ITEM),
    [TAB + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [ITEM + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
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
    const { a11y } = updateModule(this, A11Y, false, A11Y_DEFAULTS);

    updateOptsByData(
      opts,
      base,
      [
        HIDE_MODE,
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
      setAttribute(base, ROLE, a11y[ROLE]);
      a11y[OPTION_ARIA_ORIENTRATION] &&
        setAttribute(
          base,
          ARIA_ORIENTATION,
          opts[HORIZONTAL] ? HORIZONTAL : VERTICAL,
        );
    }

    const shown = lastShownTab?.index ?? opts.shown;

    const tabWithState = tabs.map((tabObj, i) => {
      const { tab, tabpanel, item, teleport } = tabObj;

      if (a11y) {
        removeAttribute(tab, ARIA_SELECTED, ARIA_EXPANDED);
        setAttribute(tab, ARIA_CONTROLS, tabpanel.id);
        setAttribute(tab, ROLE, a11y[OPTION_TAB_ROLE]);
        setAttribute(tabpanel, ROLE, a11y[OPTION_TABPANEL_ROLE]);
        setAttribute(tabpanel, ARIA_LABELLEDBY, tab.id);
        setAttribute(item, ROLE, NONE);
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
        isOpenTabpanel = isShown(tabpanel, opts.hideMode);
      }

      return [isOpenTabpanel, tabObj];
    });
    const hasSelected = tabWithState.find(([isOpen]) => isOpen);
    if (opts[OPTION_ALWAYS_EXPANDED] && !hasSelected) {
      tabWithState[0][0] = true;
    }
    tabWithState.forEach(([isOpen, tabInstance]) => {
      tabInstance[TRANSITION] = Transition.createOrUpdate(
        tabInstance[TRANSITION],
        tabInstance[TABPANEL],
        opts[TRANSITION],
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
    const { isInit, emit } = this;
    if (isInit) return;

    this.base.id = this.id;

    TABLIST_SECONDARY_METHODS.forEach(
      (name) => (this[name] = this[name].bind(this)),
    );

    emit(EVENT_BEFORE_INIT);

    this.tabs = [];
    this.initTabs();

    this._updateTabIndex();

    this._update();

    this.isInit = true;

    return emit(EVENT_INIT);
  }

  destroy({ keepInstance = false, keepState = false }) {
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
      removeAttribute(
        tablist,
        a11y[ROLE] && ROLE,
        a11y[OPTION_ARIA_ORIENTRATION] && ARIA_ORIENTATION,
      );
    }
    tablist.id.includes(uuid) && tablist.removeAttribute(ID);

    tabs.forEach((tab) => tab.destroy({ keepState }));

    if (!keepInstance) {
      instances.delete(id);
    }

    this.isInit = false;

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

    const uuid = uuidGenerator();
    const id = (tabpanel.id ||= TABPANEL + "-" + uuid);
    tab.id ||= TAB + "-" + uuid;

    let isOpen;
    if (shownTabs.length && !opts[OPTION_MULTI_EXPAND]) {
      isOpen = false;
    }
    if (opts.hashNavigation && checkHash(id)) {
      isOpen = true;
    }

    let isMouseDown;
    on(tab, EVENT_FOCUS, (e) => {
      !isMouseDown && this._onTabFocus(e);
    });
    on(tab, EVENT_KEYDOWN, (e) => this._onTabKeydown(e));
    on(tab, EVENT_MOUSEDOWN, () => {
      isMouseDown = true;
      requestAnimationFrame(() => (isMouseDown = false));
    });
    on(tab, EVENT_CLICK, (event) => {
      event.preventDefault();
      this.toggle(event.currentTarget, null, { event, trigger: tab });
    });

    const destroy = ({
      cleanStyles = true,
      remove = false,
      keepState = false,
    }) => {
      const opts = this.opts;
      const a11y = opts.a11y;
      if (a11y) {
        removeAttribute(
          tab,
          ROLE,
          a11y[TABINDEX] && TABINDEX,
          ARIA_CONTROLS,
          ARIA_EXPANDED,
          a11y[OPTION_STATE_ATTRIBUTE],
        );
        removeAttribute(
          tabpanel,
          ROLE,
          a11y[OPTION_TABPANEL_TABINDEX] && TABINDEX,
          ARIA_LABELLEDBY,
          a11y[OPTION_ARIA_HIDDEN] && ARIA_HIDDEN,
          HIDDEN,
          INERT,
        );
        removeAttribute(item, ROLE);
      }

      off(elems);
      this.tabs = without(this.tabs, tabInstance);
      if (cleanStyles) {
        ELEMS.forEach((name) =>
          removeClass(tabInstance[name], opts[name + CLASS_ACTIVE_SUFFIX]),
        );
        tabInstance[TRANSITION]?.destroy();
        tabInstance[TELEPORT]?.destroy();
      }
      tabpanel.id.includes(uuid) && tabpanel.removeAttribute(ID);
      tab.id.includes(uuid) && tab.removeAttribute(ID);

      elems.forEach((elem) => {
        if (!elem) return;

        remove && elem.remove();

        if (!keepState) {
          removeClass(elem, [HIDDEN_CLASS, SHOWN_CLASS]);
          removeAttribute(elem, HIDDEN, INERT);
        }
      });
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

    const elems = [tab, item, tabpanel];
    const tabInstance = {
      id,
      uuid,
      tab,
      item,
      tabpanel,
      elems,
      index,
      transition: opts[TRANSITION]
        ? new Transition(tabpanel, opts[TRANSITION])
        : undefined,
      destroy: destroy.bind(this),
      toggleDisabled: toggleDisabled.bind(this),
      isOpen,
      get isDisabled() {
        return tab.hasAttribute(DISABLED);
      },
      get initialPlaceNode() {
        return (
          tabInstance[TELEPORT]?.placeholder ??
          tabInstance.placeholder ??
          tabpanel
        );
      },
    };

    [ACTION_HIDE, ACTION_SHOW, ACTION_TOGGLE].forEach(
      (action) => (tabInstance[action] = this[action].bind(this, tabInstance)),
    );
    tabInstance.is = this.isTab.bind(this, tabInstance);

    addDismiss(this, tabpanel, tabInstance.hide);

    if (opts[HIDE_MODE] === ACTION_REMOVE && tabpanel[HIDDEN]) {
      toggleHideModeState(false, this, tabpanel, tabInstance);
    }

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

    const { opts, shownTabs, emit } = this;
    const { a11y, awaitAnimation } = opts;
    const { tab, isOpen, transition, index, tabpanel } = tabInstance;

    s = !!(s ?? !isOpen);

    s && this._updateTabIndex(index);

    if (
      s === isOpen ||
      (awaitAnimation &&
        transition.isAnimating &&
        ((shownTabs.length <= 1 && !opts[OPTION_MULTI_EXPAND]) ||
          opts[OPTION_MULTI_EXPAND])) ||
      (isOpen && opts[OPTION_ALWAYS_EXPANDED] && !s && shownTabs.length < 2) ||
      (s && !this.focusFilter(tabInstance))
    )
      return;

    if (transition.isAnimating && !awaitAnimation) {
      await transition.cancel();
    }

    const eventParams = { event, trigger };

    !silent &&
      emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, tabInstance, eventParams);

    tabInstance.isOpen = s;

    if (!opts[OPTION_MULTI_EXPAND] && s) {
      const animatedOrShownTabs = this.tabs.filter(
        (tab) =>
          tab !== tabInstance && (tab.transition.isAnimating || tab.isOpen),
      );
      for (const tab of animatedOrShownTabs) {
        if (tab.isOpen && tab.transition.isAnimating) {
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

    s && toggleHideModeState(true, this, tabpanel, tabInstance);

    !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, tabInstance, eventParams);

    const promise = transition?.run(s, animated);

    ELEMS.forEach((elemName) =>
      toggleClass(
        tabInstance[elemName],
        opts[elemName + CLASS_ACTIVE_SUFFIX],
        s,
      ),
    );

    if (a11y) {
      a11y[OPTION_STATE_ATTRIBUTE] &&
        setAttribute(tab, a11y[OPTION_STATE_ATTRIBUTE], !!s);
    }

    if (s) {
      this.lastShownTab = tabInstance;
      this.currentTabIndex ??= index;
    }

    awaitPromise(promise, () => {
      !s && toggleHideModeState(false, this, tabpanel, tabInstance);
      !silent && emit(s ? EVENT_SHOWN : EVENT_HIDDEN, tabInstance, eventParams);
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

export default Tablist;
