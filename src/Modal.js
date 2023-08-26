import {
  DEFAULT_OPTIONS,
  body,
  ROLE,
  UI_PREFIX,
  VAR_UI_PREFIX,
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
  ARIA_LABELLEDBY,
  ARIA_DESCRIBEDBY,
  TABINDEX,
  HIDE_MODE,
  EVENT_SHOW,
  EVENT_HIDE,
  EVENT_CLICK,
  EVENT_MOUSEDOWN,
  EVENT_RIGHT_CLICK,
  EVENT_HIDE_PREVENTED,
  EVENT_BEFORE_INIT,
  EVENT_HIDDEN,
  EVENT_SHOWN,
  OPTION_GROUP,
  AUTOFOCUS,
  ACTION_DESTROY,
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
  UI_EVENT_PREFIX,
  POPOVER_API_SUPPORTED,
} from "./helpers/constants";
import { isString, isElement, isFunction } from "./helpers/is";
import {
  getElements,
  toggleClass,
  removeClass,
  focus,
  closest,
  setAttribute,
  removeAttribute,
} from "./helpers/dom";
import {
  arrayFrom,
  getDataSelector,
  uuidGenerator,
  normalizeToggleParameters,
  getEventsPrefix,
  getDefaultToggleSelector,
  updateModule,
  getOptionElem,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  callAutofocus,
  addEscapeHide,
  callInitShow,
  awaitPromise,
} from "./helpers/modules";
import Base from "./helpers/Base";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";
import { FocusGuards } from "./helpers/modules/index.js";

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
    detectPopoverApi: true,
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
      (teleportOpts == null && _fromHTML) || teleportOpts === true
        ? body
        : teleportOpts,
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
      // modal.show();
      if (isDialog) {
        if (
          opts.focusTrap &&
          (!opts.detectPopoverApi || POPOVER_API_SUPPORTED)
        ) {
          modal.showModal();
          Modal.dispatchTopLayer(MODAL);
        } else {
          modal.show();
        }
      } else if (opts.focusTrap) {
        this.focusGuards = new FocusGuards(modal);
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
      this.focusGuards?.destroy();
      this.focusGuards = null;
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
    if (this.opts.returnFocus && this.modal.contains(doc.activeElement)) {
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

export default Modal;
