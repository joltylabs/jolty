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
  ARIA_MULTISELECTABLE,
  ARIA_LABELLEDBY,
  ARIA_HIDDEN,
  ARIA_EXPANDED,
  ARIA_ORIENTATION,
  ROLE,
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
  OPTION_ARIA_CONTROLS,
  OPTION_ARIA_LABELLEDBY,
  OPTION_ARIA_EXPANDED,
  OPTION_ARIA_HIDDEN,
  CLASS_ACTIVE_SUFFIX,
  doc,
} from "./helpers/constants";
import Base from "./helpers/Base.js";
import {
  isString,
  isElement,
  isNumber,
  isFunction,
  isArray,
  isUndefined,
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
} from "./helpers/utils";
import {
  toggleClass,
  removeClass,
  removeAttr,
  next,
  focus,
  parents,
  setAttribute,
} from "./helpers/dom";
import { addDismiss } from "./helpers/modules";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";

const TABLIST = "tablist";
const TAB = "tab";
const TABPANEL = "tabpanel";
const ITEM = "item";
const ELEMS = [ITEM, TAB, TABPANEL];
const ROLE_SUFFIX = upperFirst(ROLE);
const OPTION_TAB_ROLE = TAB + ROLE_SUFFIX;
const OPTION_TABPANEL_ROLE = TABPANEL + ROLE_SUFFIX;
const OPTION_TABPANEL_TABINDEX = TABPANEL + upperFirst(TABINDEX);
const OPTION_ITEM_ROLE = ITEM + ROLE_SUFFIX;
const OPTION_ARIA_ORIENTRATION = kebabToCamel(ARIA_ORIENTATION);
const OPTION_ARIA_MULTISELECTABLE = kebabToCamel(ARIA_MULTISELECTABLE);

const TABLIST_SECONDARY_METHODS = ["getTab", "isTab", "initTab", "initTabs"];

class Tablist extends Base {
  static DefaultA11y = {
    [ROLE]: TABLIST,
    [OPTION_TAB_ROLE]: TAB,
    [OPTION_TABPANEL_ROLE]: TABPANEL,
    [OPTION_ITEM_ROLE]: "presentation",
    [OPTION_ARIA_ORIENTRATION]: true,
    [OPTION_ARIA_MULTISELECTABLE]: true,
    [OPTION_ARIA_CONTROLS]: true,
    [OPTION_ARIA_LABELLEDBY]: true,
    [OPTION_ARIA_EXPANDED]: true,
    [TABINDEX]: true,
    [OPTION_TABPANEL_TABINDEX]: true,
  };
  static Default = {
    ...DEFAULT_OPTIONS,
    eventPrefix: getEventsPrefix(TABLIST),
    siblings: true,
    alwaysExpanded: false,
    multiExpand: false,
    awaiteAnimation: false,
    awaitePrevious: false,
    keyboard: true,
    arrowActivation: false,
    hashNavigation: true,
    rtl: false,
    focusFilter: null,
    horizontal: false,
    dismiss: true,
    [TAB]: getDataSelector(TABLIST, TAB),
    [TABPANEL]: getDataSelector(TABLIST, TABPANEL),
    [ITEM]: getDataSelector(TABLIST, ITEM),
    [TAB + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [ITEM + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [TABPANEL + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    teleport: null,
    transition: null,
    // teleport: null,
  };
  static _data = {};
  static instances = new Map();
  static get NAME() {
    return TABLIST;
  }
  constructor(elem, opts = {}) {
    super({ opts, elem });
  }
  _update() {
    const { a11y } = updateModule(this, A11Y);
    const { tablist, tabs, lastShownTab, opts } = this;

    if (a11y) {
      a11y[ROLE] && setAttribute(tablist, ROLE, a11y[ROLE]);
      a11y[OPTION_ARIA_MULTISELECTABLE] &&
        setAttribute(tablist, ARIA_MULTISELECTABLE, opts.multiExpand || null);
      a11y[OPTION_ARIA_ORIENTRATION] &&
        setAttribute(
          tablist,
          ARIA_ORIENTATION,
          opts[HORIZONTAL] ? HORIZONTAL : VERTICAL,
        );
    }

    const shown = lastShownTab?.index ?? opts.shown;

    const tabWithState = tabs.map((tabObj, i) => {
      const { tab, tabpanel, item, teleport, transition } = tabObj;

      if (a11y) {
        a11y[OPTION_ARIA_CONTROLS] &&
          setAttribute(tab, ARIA_CONTROLS, tabpanel.id);
        a11y[OPTION_TAB_ROLE] && setAttribute(tab, ROLE, a11y[OPTION_TAB_ROLE]);
        a11y[OPTION_TABPANEL_ROLE] &&
          setAttribute(tabpanel, ROLE, a11y[OPTION_TABPANEL_ROLE]);
        a11y[OPTION_ARIA_LABELLEDBY] &&
          setAttribute(tabpanel, ARIA_LABELLEDBY, tab.id);
        a11y[OPTION_ITEM_ROLE] &&
          setAttribute(item, ROLE, a11y[OPTION_ITEM_ROLE]);
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
      removeAttr(tablist, [
        a11y[ROLE] && ROLE,
        a11y[OPTION_ARIA_MULTISELECTABLE] && ARIA_MULTISELECTABLE,
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
    return this.getOptionElems(this.opts[TAB], this.tablist)
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

    const { tabs, tablist, opts, selected, on, off } = this;
    const index = tabs.length;

    const tabpanelId = tab.getAttribute(DATA_UI_PREFIX + TABLIST + "-" + TAB);
    let tabpanel = tabpanelId && doc.getElementById(tabpanelId);
    const item = isString(opts[ITEM])
      ? tab.closest(opts[ITEM])
      : callOrReturn(opts[ITEM], { tablist, tab, index });
    if (!tabpanel) {
      if (isFunction(opts[TABPANEL])) {
        tabpanel = opts[TABPANEL]({ tablist, tab, index });
      } else {
        tabpanel = opts.siblings && next(tab, opts[TABPANEL]);
      }
    }

    if (!tabpanel) return;

    const uuid = uuidGenerator();
    const id = (tabpanel.id ||= TABPANEL + "-" + uuid);
    tab.id ||= TAB + "-" + uuid;

    let isShown;
    if (selected.length && !opts.multiExpand) {
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
        removeAttr(tab, [
          a11y[OPTION_TAB_ROLE] && ROLE,
          !isUndefined(a11y[TABINDEX]) && TABINDEX,
          a11y[OPTION_ARIA_CONTROLS] && ARIA_CONTROLS,
          a11y[OPTION_ARIA_EXPANDED] && ARIA_EXPANDED,
        ]);
        removeAttr(tabpanel, [
          a11y[OPTION_TABPANEL_ROLE] && ROLE,
          a11y[OPTION_TABPANEL_TABINDEX] && TABINDEX,
          a11y[OPTION_ARIA_LABELLEDBY] && ARIA_LABELLEDBY,
          a11y[OPTION_ARIA_HIDDEN] && ARIA_HIDDEN,
          HIDDEN,
          INERT,
        ]);
        removeAttr(item, a11y[OPTION_ITEM_ROLE] && ROLE);
      }

      off(elems);
      this.tabs = without(this.tabs, tabIntstance);
      if (clean) {
        ELEMS.forEach((name) =>
          removeClass(tabIntstance[name], opts[name + CLASS_ACTIVE_SUFFIX]),
        );
        tabIntstance.transition?.destroy();
        tabIntstance.teleport?.destroy();
      }
      tabpanel.id.includes(uuid) && tabpanel.removeAttribute(ID);
      tab.id.includes(uuid) && tab.removeAttribute(ID);

      if (remove) {
        elems.forEach((elem) => elem && elem.remove());
      }
    };

    const toggleDisabled = (s = null) => {
      const disabled = tab.toggleAttribute(DISABLED, s);

      disabled && tabIntstance.hide(false);

      if (this.opts.alwaysExpanded) {
        const selected = this.selected;
        if (
          !selected.length ||
          (selected.length === 1 && selected[0].isDisabled)
        ) {
          this.show(this.firstActiveTabIndex, false);
        }
      }

      return !disabled;
    };

    const transition = new Transition(tabpanel, opts.transition);

    const elems = [tab, item, tabpanel];
    const tabIntstance = {
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
      get shownPlaceNode() {
        return (
          tabIntstance.teleport?.placeholder ??
          tabIntstance.transition?.placeholder ??
          tabpanel
        );
      },
    };

    [ACTION_HIDE, ACTION_SHOW, ACTION_TOGGLE].forEach(
      (action) =>
        (tabIntstance[action] = this[action].bind(this, tabIntstance)),
    );
    tabIntstance.is = this.isTab.bind(this, tabIntstance);

    addDismiss(this, tabpanel, tabIntstance.hide);

    tabs.push(tabIntstance);
    return tabIntstance;
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
    const tabIntstance = this.getTab(currentTarget);
    if (!tabIntstance || !this.focusFilter(tabIntstance)) return;

    this.opts.arrowActivation && !tabIntstance.isShown && tabIntstance.show();

    this.currentTabIndex = tabIntstance.index;
  }
  _onTabKeydown(event) {
    const tabIntstance = this.getTab(event.currentTarget);
    const currentIndex = this.tabs.indexOf(tabIntstance);
    const { keyboard, rtl, horizontal } = this.opts;
    const { keyCode } = event;

    if (
      [KEY_ENTER, KEY_SPACE].includes(keyCode) &&
      !/BUTTON|A/.test(tabIntstance.tab.nodeName)
    )
      return tabIntstance.toggle(null, { event, trigger: event.target });
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
    if (!keyboard) return;
    activeIndex ??= this.selected[0]?.index ?? this.firstActiveTabIndex;
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
  get selected() {
    return this.tabs.filter(({ isShown }) => isShown);
  }
  get firstActiveTabIndex() {
    return this.tabs.find((tab) => this.focusFilter(tab))?.index;
  }
  get lastActiveTabIndex() {
    return this.tabs.findLast((tab) => this.focusFilter(tab))?.index;
  }
  show(elem, opts) {
    return this.toggle(elem, true, opts);
  }
  hide(elem, opts) {
    return this.toggle(elem, false, opts);
  }
  async toggle(elem, s, params) {
    const { animated, silent, event, trigger } =
      normalizeToggleParameters(params);
    const tabIntstance = this.getTab(elem);

    if (!tabIntstance) return;

    const { opts, selected, emit } = this;
    const { tab, tabpanel, isShown, transition, index } = tabIntstance;

    s = !!(s ?? !isShown);

    s && this._updateTabIndex(index);

    if (
      s === isShown ||
      (opts.awaiteAnimation &&
        transition.isAnimating &&
        ((selected.length <= 1 && !opts.multiExpand) || opts.multiExpand)) ||
      (isShown && opts.alwaysExpanded && !s && selected.length < 2) ||
      (s && !this.focusFilter(tabIntstance))
    )
      return;

    if (transition.isAnimating && !opts.awaitAnimation) {
      await transition.cancel();
    }

    const eventParams = { event, trigger };

    !silent &&
      emit(
        s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE,
        tabIntstance,
        eventParams,
      );

    tabIntstance.isShown = s;

    if (!opts.multiExpand && s) {
      for (const selectedTab of selected) {
        if (tabIntstance !== selectedTab && selectedTab.isShown) {
          const promise = selectedTab.hide(animated);
          if (opts.awaitePrevious) await promise;
        }
      }
    }

    if (s && !tabIntstance.isShown) return;

    ELEMS.forEach((elemName) =>
      toggleClass(
        tabIntstance[elemName],
        opts[elemName + CLASS_ACTIVE_SUFFIX],
        s,
      ),
    );

    const a11y = opts.a11y;
    if (a11y) {
      a11y[OPTION_ARIA_EXPANDED] && setAttribute(tab, ARIA_EXPANDED, s);
      a11y[OPTION_ARIA_HIDDEN] && setAttribute(tabpanel, ARIA_HIDDEN, !s);
    }

    const promise = transition.run(s, animated, {
      [s ? EVENT_SHOW : EVENT_HIDE]: () =>
        !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, tabIntstance, eventParams),
      [EVENT_DESTROY]: () =>
        tabIntstance.destroy({ remove: true, destroyTransition: false }),
    });
    animated && opts.awaiteAnimation && (await promise);

    if (s) {
      this.lastShownTab = tabIntstance;
      this.currentTabIndex ??= index;
    }

    !silent && emit(s ? EVENT_SHOWN : EVENT_HIDDEN, tabIntstance, eventParams);

    return s ? tabIntstance : null;
  }

  static show(elem, params) {
    return this.toggle(elem, true, params);
  }
  static hide(elem, params) {
    return this.toggle(elem, false, params);
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

export default Tablist;
