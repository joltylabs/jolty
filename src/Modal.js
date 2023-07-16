import {
  DEFAULT_OPTIONS,
  body,
  ROLE,
  UI_PREFIX,
  VAR_UI_PREFIX,
  DATA_UI_PREFIX,
  PX,
  MODAL,
  CONTENT,
  BACKDROP,
  SCROLL,
  WIDTH,
  ROOT,
  DEFAULT_AUTOFOCUS,
  SELECTOR_ROOT,
  ACTION_PREVENT,
  ARIA_MODAL,
  ARIA_LABELLEDBY,
  ARIA_DESCRIBEDBY,
  TABINDEX,
  HIDDEN_MODE,
  EVENT_INIT,
  EVENT_SHOW,
  EVENT_HIDE,
  EVENT_CLICK,
  EVENT_MOUSEDOWN,
  EVENT_RIGHT_CLICK,
  EVENT_HIDE_PREVENTED,
  EVENT_BEFORE_INIT,
  EVENT_HIDDEN,
  EVENT_SHOWN,
  A11Y,
  OPTION_GROUP,
  OPTION_BACKDROP_OUTSIDE,
  AUTOFOCUS,
  OPTION_ARIA_MODAL,
  FOCUSABLE_ELEMENTS_SELECTOR,
  ACTION_DESTROY,
  SUPPORTS_DIALOG,
  TITLE,
  OPTION_PREVENT_SCROLL,
  NAME,
  EVENT_BEFORE_HIDE,
  EVENT_BEFORE_SHOW,
  SELECTOR_DATA_CANCEL,
  SELECTOR_DATA_CONFIRM,
  CANCEL,
  CONFIRM,
  CLASS_ACTIVE,
  TOGGLER,
  CLASS_ACTIVE_SUFFIX,
  DIALOG,
  doc,
} from "./helpers/constants";
import { isString, isElement, isFunction } from "./helpers/is";
import {
  getElements,
  toggleClass,
  removeClass,
  focus,
  closest,
  setAttribute,
  removeAttr,
} from "./helpers/dom";
import {
  arrayFrom,
  callOrReturn,
  getDataSelector,
  uuidGenerator,
  normalizeToggleParameters,
  getEventsPrefix,
  getDefaultToggleSelector,
  updateModule,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  callAutofocus,
  addEscapeHide,
  callInitShow,
  callToggleAsyncMethods,
} from "./helpers/modules";
import Base from "./helpers/Base";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";

const DOM_ELEMENTS = [MODAL, BACKDROP, CONTENT];
const CLASS_PREVENT_SCROLL =
  UI_PREFIX + MODAL + "-" + ACTION_PREVENT + "-" + SCROLL;
const PROPERTY_MODAL_DEEP = VAR_UI_PREFIX + MODAL + "-deep";
const DATA_MODAL_DEEP = DATA_UI_PREFIX + MODAL + "-deep";

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
    focusableElements: FOCUSABLE_ELEMENTS_SELECTOR,
  };
  static DefaultA11y = {
    [OPTION_ARIA_MODAL]: false,
    [TABINDEX]: -1,
    [ROLE]: DIALOG,
    disableIfDialog: true,
  };
  static Default = {
    ...DEFAULT_OPTIONS,
    eventPrefix: getEventsPrefix(MODAL),
    escapeHide: true,
    backdropHide: true,
    rightClickHide: true,
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
    [OPTION_BACKDROP_OUTSIDE]: null,
    [TOGGLER]: true,
    [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
  };

  constructor(elem, opts = {}) {
    super({ elem, opts });
  }
  get transition() {
    return this.transitions[MODAL];
  }
  _update() {
    updateModule(this, OPTION_GROUP, NAME);
    updateModule(this, OPTION_PREVENT_SCROLL);
    updateModule(this, AUTOFOCUS);
    updateModule(this, A11Y);

    this.transitions ||= {};

    let {
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

    if (teleportOpts === null && (!isDialog || _fromHTML)) {
      teleportOpts = body;
    }
    this.teleport = Teleport.createOrUpdate(teleport, modal, teleportOpts, {
      keepPlace: false,
    })?.move(this);

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

    this.togglers = toggler === true ? getDefaultToggleSelector(id) : toggler;

    if (
      a11y &&
      (!isDialog || (isDialog && SUPPORTS_DIALOG && !a11y.disableIfDialog))
    ) {
      a11y[ROLE] && setAttribute(modal, ROLE, a11y[ROLE]);
      a11y[OPTION_ARIA_MODAL] &&
        setAttribute(modal, ARIA_MODAL, a11y[OPTION_ARIA_MODAL]);
      a11y[TABINDEX] && setAttribute(modal, TABINDEX, 0);
    }

    if (escapeHide) {
      on(modal, CANCEL, (e) => e.preventDefault());
    } else {
      off(modal, CANCEL);
    }

    return this;
  }
  init() {
    const { opts, getOptionElem, isInit, modal, on, emit, hide, toggle } = this;

    if (isInit) return;

    emit(EVENT_BEFORE_INIT);

    this[BACKDROP] = opts[OPTION_BACKDROP_OUTSIDE]
      ? getOptionElem(opts[OPTION_BACKDROP_OUTSIDE])
      : getOptionElem(opts[BACKDROP], modal);
    this[CONTENT] = getOptionElem(opts[CONTENT], modal);

    this._update();
    this.updateAriaTargets();
    addDismiss(this);

    on(
      modal,
      [EVENT_CLICK, opts.rightClickHide && EVENT_RIGHT_CLICK],
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

    on(body, EVENT_CLICK, (event) => {
      const togglers = this.togglers;
      const trigger = isString(togglers)
        ? event.target.closest(togglers)
        : closest(event.target, togglers);
      if (trigger) {
        event.preventDefault();
        toggle(null, { trigger, event });
      }
    });

    // isDialog && SUPPORTS_DIALOG && on(modal, EVENT_CLOSE, (event) => hide({ event }));

    return callInitShow(this);
  }
  destroy(destroyOpts) {
    if (!this.isInit) return;
    const { base, opts, title, description, togglers } = this;
    const { a11y } = opts;
    removeClass(togglers, opts[TOGGLER + CLASS_ACTIVE]);
    removeAttr(base, [
      a11y[(base, OPTION_ARIA_MODAL)] && ARIA_MODAL,
      a11y[TABINDEX] && TABINDEX,
      a11y[ROLE] && ROLE,
      title && ARIA_LABELLEDBY,
      description && ARIA_DESCRIBEDBY,
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
        elem = this.getOptionElem(elem, base);
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
    const hasPreventScrollModals = this.shownPreventScrollModals.length;
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

    if (s && opts.group?.hidePrevious) {
      const shownGroupModals = this.shownGroupModals;
      if (shownGroupModals.length > 1) {
        const promises = Promise.allSettled(
          shownGroupModals.map((modal) => modal !== this && modal.hide()),
        );
        if (opts.group.awaitPrevious) {
          await promises;
        }
      }
    }

    toggleClass(
      getElements(callOrReturn(opts[TOGGLER], this)),
      opts[TOGGLER + CLASS_ACTIVE],
      s,
    );

    if (s) {
      transitions[MODAL].toggleRemove(true);
      transitions[CONTENT].toggleRemove(true);
      if (isDialog && SUPPORTS_DIALOG) {
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

    opts.group &&
      this.shownGroupModals.reverse().forEach(({ modal }, i) => {
        modal.style.setProperty(PROPERTY_MODAL_DEEP, i);
        setAttribute(modal, DATA_MODAL_DEEP, i || null);
      });

    !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

    for (const elemName of [MODAL, BACKDROP, CONTENT]) {
      if (elemName === BACKDROP && backdropIsOpen) {
        continue;
      }
      const transitionOpts = { allowRemove: elemName !== MODAL };
      if (elemName === MODAL && !s) {
        if (opts.group) {
          transitionOpts[EVENT_HIDE] = () =>
            modal.style.removeProperty(PROPERTY_MODAL_DEEP);
        }
      }
      transitions[elemName]?.run(s, animated, transitionOpts);
    }

    this._preventScroll(s);

    const promise = Promise.allSettled(
      Object.values(transitions).flatMap(({ promises }) => promises),
    );

    if (!s && (!isDialog || !SUPPORTS_DIALOG)) {
      opts.returnFocus &&
        modal.contains(doc.activeElement) &&
        focus(this.returnFocusElem);
    }

    opts.escapeHide && addEscapeHide(this, s);

    if (s) {
      !ignoreAutofocus && opts.autofocus && callAutofocus(this);

      on(content, EVENT_MOUSEDOWN, (e) => {
        this._mousedownTarget = e.target;
      });
    } else {
      this._mousedownTarget = null;

      off(content, EVENT_MOUSEDOWN);

      if (isDialog && SUPPORTS_DIALOG) {
        modal.close();
      }
    }

    callToggleAsyncMethods(promise, this, s, eventParams, silent, () => {
      if (!s) {
        transitions[MODAL].toggleRemove(false);
        if (transitions[MODAL].opts[HIDDEN_MODE] === ACTION_DESTROY) {
          this.destroy({ remove: true });
        }
      }
    });

    animated && opts.awaitAnimation && (await promise);

    return this;
  }

  get isDialog() {
    return this[MODAL].tagName === "DIALOG";
  }
  get isAnimating() {
    return DOM_ELEMENTS.some(
      (elemName) => this.transitions[elemName]?.isAnimating,
    );
  }
  get isEntering() {
    return DOM_ELEMENTS.some(
      (elemName) => this.transitions[elemName]?.isEntering,
    );
  }
  get shownPreventScrollModals() {
    return Modal.shownModals.filter(({ opts }) => opts.preventScroll);
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

export default Modal;
