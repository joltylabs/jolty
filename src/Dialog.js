import {
  DEFAULT_OPTIONS,
  body,
  ROLE,
  UI_PREFIX,
  VAR_UI_PREFIX,
  PX,
  CONTENT,
  BACKDROP,
  SCROLL,
  WIDTH,
  ROOT,
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
  ACTION_DESTROY,
  TITLE,
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
  MODAL,
  OPTION_TOP_LAYER,
  OPTION_PREVENT_SCROLL,
} from "./helpers/constants";
import { isString, isElement, isFunction, isDialog } from "./helpers/is";
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
  updateOptsByData,
  upperFirst,
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

const DOM_ELEMENTS = [DIALOG, BACKDROP, CONTENT];
const CLASS_PREVENT_SCROLL =
  UI_PREFIX + DIALOG + "-" + ACTION_PREVENT + "-" + SCROLL;

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

const DIALOG_DATA_OPTIONS = [
  [MODAL, DIALOG + upperFirst(MODAL)],
  [OPTION_TOP_LAYER, DIALOG + upperFirst(OPTION_TOP_LAYER)],
  [OPTION_PREVENT_SCROLL, DIALOG + upperFirst(OPTION_PREVENT_SCROLL)],
];

class Dialog extends ToggleMixin(Base, DIALOG) {
  static DefaultGroup = {
    name: "",
    awaitPrevious: true,
    hidePrevious: true,
  };
  static Default = {
    ...DEFAULT_OPTIONS,
    eventPrefix: getEventsPrefix(DIALOG),
    escapeHide: true,
    backdropHide: true,
    hashNavigation: false,
    returnFocus: true,
    hideable: true,
    dismiss: true,
    preventScroll: true,
    cancel: SELECTOR_DATA_CANCEL,
    confirm: SELECTOR_DATA_CONFIRM,
    title: getDataSelector(DIALOG, ARIA_SUFFIX[ARIA_LABELLEDBY]),
    description: getDataSelector(DIALOG, ARIA_SUFFIX[ARIA_DESCRIBEDBY]),
    group: "",
    awaitAnimation: false,
    [CONTENT]: getDataSelector(DIALOG, CONTENT),
    [BACKDROP]: getDataSelector(DIALOG, BACKDROP),
    [TOGGLER]: true,
    [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [DIALOG + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,

    autofocus: true,
    focusTrap: true,

    modal: true,
    topLayer: true,
    moveIfModal: true,
    moveIfPopover: true,

    popoverApi: true,
    safeModal: true,
  };

  constructor(elem, opts) {
    super(elem, opts);
  }
  get transition() {
    return this.transitions[DIALOG];
  }
  _update() {
    this.opts = updateOptsByData(
      this.opts,
      this.base.dataset,
      DIALOG_DATA_OPTIONS,
    );

    updateModule(this, OPTION_GROUP, NAME);

    this.transitions ||= {};

    const {
      base,
      transitions,
      opts: { transitions: transitionsOpts, toggler, a11y, topLayer },
      _fromHTML,
      teleport,
      id,
      on,
    } = this;

    this.teleport = Teleport.createOrUpdate(
      teleport,
      base,
      topLayer === true || _fromHTML ? body : false,
      {
        disableAttributes: true,
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

    if (a11y && !isDialog(base)) {
      setAttribute(base, TABINDEX, -1);
      setAttribute(base, ROLE, DIALOG);
    }

    if (isDialog(base)) {
      on(base, CANCEL + UI_EVENT_PREFIX, (e) => e.preventDefault());
    }

    return this;
  }
  init() {
    const { opts, isInit, base, on, emit, hide, toggle } = this;
    const optsBackdrop = opts[BACKDROP];

    if (isInit) return;

    emit(EVENT_BEFORE_INIT);

    let backdrop;
    if (optsBackdrop) {
      if (isFunction(optsBackdrop)) {
        backdrop = optsBackdrop(this);
      }
      if (isString(optsBackdrop)) {
        backdrop = (optsBackdrop[0] === "#" ? doc : base).querySelector(
          optsBackdrop,
        );
      }
    }
    this[BACKDROP] = backdrop;

    this[CONTENT] = getOptionElem(this, opts[CONTENT], base);

    this._update();
    this.updateAriaTargets();
    addDismiss(this);

    on(
      base,
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
    this.focusGuards?.destroy();
    this.focusGuards = null;
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
        ? (elem.id ||= uuidGenerator(DIALOG + "-" + suffix + "-"))
        : elem;
      setAttribute(base, name, id);
    }
    return this;
  }
  preventScroll(s) {
    const hasPreventScrollDialogs = Dialog.shownDialogs.filter(
      ({ opts }) => opts[OPTION_PREVENT_SCROLL],
    ).length;

    if ((s && hasPreventScrollDialogs) || (!s && !hasPreventScrollDialogs)) {
      toggleClass(
        body,
        isString(this.opts[OPTION_PREVENT_SCROLL])
          ? this.opts[OPTION_PREVENT_SCROLL]
          : CLASS_PREVENT_SCROLL,
        s,
      );
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
      base,
      content,
      backdrop,
    } = this;

    let optReturnFocusAwait =
      opts.returnFocus && (opts.returnFocus?.await ?? opts.group.awaitPrevious);

    const { animated, silent, trigger, event, ignoreConditions } =
      normalizeToggleParameters(params);

    const baseIsDialog = isDialog(base);

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

    const backdropIsOpen = Dialog.shownDialogs.find(
      (instance) => instance !== this && instance[BACKDROP] === backdrop,
    );

    const shownGroupDialogs = this.shownGroupDialogs;
    if (s) {
      if (shownGroupDialogs.length > 1) {
        const promises = Promise.allSettled(
          shownGroupDialogs
            .filter((m) => m !== this)
            .map((instance) => instance.hide() && instance.transitionPromise),
        );
        if (opts.group.awaitPrevious) {
          await promises;
        }
      }
    } else if (!s && !shownGroupDialogs.length) {
      optReturnFocusAwait = false;
    }

    toggleClass(
      getElements(this._togglers),
      opts[TOGGLER + CLASS_ACTIVE_SUFFIX],
      s,
    );

    toggleClass(base, opts[DIALOG + CLASS_ACTIVE_SUFFIX], s);

    if (s) {
      transitions[DIALOG].toggleRemove(true);
      transitions[CONTENT].toggleRemove(true);
      if (baseIsDialog) {
        if (
          opts.focusTrap &&
          (!opts.safeModal || POPOVER_API_SUPPORTED) &&
          opts.modal
        ) {
          if (base.open) base.close();
          base.showModal();
          Dialog.dispatchTopLayer(MODAL);
        } else {
          base.show();
        }
      } else if (opts.focusTrap) {
        this.focusGuards = new FocusGuards(base);
      }
      if (opts.returnFocus) {
        this.returnFocusElem = doc.activeElement;
      }
    }

    !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

    for (const elemName of [DIALOG, BACKDROP, CONTENT]) {
      if (elemName === BACKDROP && backdropIsOpen) {
        continue;
      }
      const transitionOpts = { allowRemove: elemName !== DIALOG };

      if (elemName !== DIALOG) {
        transitions[elemName]?.run(s, animated, transitionOpts);
      }
    }

    this.preventScroll(s);

    if (!s && !optReturnFocusAwait) {
      this.returnFocus();
    }

    opts.escapeHide && addEscapeHide(this, s);

    if (s) {
      opts.autofocus && callAutofocus(this);
      on(content, EVENT_MOUSEDOWN + UI_EVENT_PREFIX, (e) => {
        this._mousedownTarget = e.target;
      });
    } else {
      this._mousedownTarget = null;
      off(content, EVENT_MOUSEDOWN + UI_EVENT_PREFIX);
      if (baseIsDialog && !optReturnFocusAwait) {
        base.close();
      }
      this.focusGuards?.destroy();
      this.focusGuards = null;
    }

    const promise = this.transitionPromise;

    awaitPromise(promise, () => {
      emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);

      if (!s && optReturnFocusAwait) {
        if (baseIsDialog) {
          base.close();
        }
        this.returnFocus();
      }
      if (!s) {
        transitions[DIALOG].toggleRemove(false);
        if (transitions[DIALOG].opts[HIDE_MODE] === ACTION_DESTROY) {
          this.destroy({ remove: true });
        }
      }
    });

    animated && opts.awaitAnimation && (await promise);

    return this;
  }

  returnFocus() {
    if (this.opts.returnFocus && this.base.contains(doc.activeElement)) {
      focus(this.returnFocusElem);
    }
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

  get groupDialogs() {
    return arrayFrom(this.instances.values()).filter(
      ({ opts }) => opts.group?.name === this.opts.group?.name,
    );
  }
  static get shownDialogs() {
    return arrayFrom(this.instances.values()).filter(({ isOpen }) => isOpen);
  }
  get shownGroupDialogs() {
    return this.groupDialogs.filter(({ isOpen, opts }) => opts.group && isOpen);
  }
  static updateBodyScrollbarWidth() {
    updateBodyScrollbarWidth();
  }
}

export default Dialog;
