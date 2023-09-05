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
  DATA_APPEAR,
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
} from "./helpers/constants";
import Base from "./helpers/Base.js";
import {
  isString,
  isElement,
  isNumber,
  isFunction,
  isArray,
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
  updateModule,
  upperFirst,
  getOptionElems,
  isShown,
  updateOptsByData,
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
import { addDismiss, awaitPromise } from "./helpers/modules";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";

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
    this.opts = updateOptsByData(this.opts, this.base, [HIDE_MODE]);
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
      const { tab, tabpanel, teleport } = tabObj;

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

      let isShownTabpanel;
      if (isFunction(shown)) {
        isShownTabpanel = shown(tabObj);
      } else if (isArray(shown)) {
        isShownTabpanel = shown.some((val) => val === i || val === tabpanel.id);
      } else if (shown !== null) {
        isShownTabpanel = tabpanel.id === shown || i === shown;
      } else {
        isShownTabpanel = isShown(tabpanel, opts.hideMode);
      }

      return [isShownTabpanel, tabObj];
    });
    const hasSelected = tabWithState.find(([isShown]) => isShown);
    if (opts.alwaysExpanded && !hasSelected) {
      tabWithState[0][0] = true;
    }
    tabWithState.forEach(([isShown, { transition, toggle, tabpanel }]) => {
      transition?.update(this.opts, { cssVariables: true });
      toggle(isShown, {
        animated: opts.appear ?? tabpanel.hasAttribute(DATA_APPEAR),
        silent: !isShown,
      });
    });
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

    const transition = new Transition(this, { base: tabpanel });

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
        transition?.isAnimating &&
        ((shownTabs.length <= 1 && !multiExpand) || multiExpand)) ||
      (isShown && opts.alwaysExpanded && !s && shownTabs.length < 2) ||
      (s && !this.focusFilter(tabInstance))
    )
      return;

    if (transition?.isAnimating && !awaitAnimation) {
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
          if (opts.awaitPrevious) await shownTab.transition?.getAwaitPromise();
        }
      }
    }

    if (s && !tabInstance.isShown) return;

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
        setAttribute(tab, a11y[OPTION_STATE_ATTRIBUTE], s);
    }

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
  awaitPrevious: true,
  a11y: TABS,
});

export default Tablist;
