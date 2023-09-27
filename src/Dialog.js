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
  TITLE,
  NAME,
  EVENT_BEFORE_HIDE,
  EVENT_BEFORE_SHOW,
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
  POPOVER,
  POPOVER_API_MODE_MANUAL,
  DATA_UI_PREFIX,
  ACTION_REMOVE,
  HIDDEN,
  TELEPORT,
  TRANSITION,
  PRIVATE_OPTION_CANCEL_ON_HIDE,
  OPTION_HASH_NAVIGATION,
  NONE,
  OPTION_AUTODESTROY,
  OPTION_MOVE_TO_ROOT,
  BODY,
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
  getOptionElem,
  updateOptsByData,
  awaitPromise,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  callAutofocus,
  addEscapeHide,
  callShowInit,
  toggleConfirm,
  addHashNavigation,
  toggleHideModeState,
  updateModule,
} from "./helpers/modules";
import Base from "./helpers/Base";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";
import { FocusGuards } from "./helpers/modules/index.js";

// const DOM_ELEMENTS = [DIALOG, BACKDROP, CONTENT];
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

class Dialog extends ToggleMixin(Base, DIALOG) {
  static [PRIVATE_OPTION_CANCEL_ON_HIDE] = true;
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
    [OPTION_HASH_NAVIGATION]: false,
    returnFocus: true,
    preventHide: false,
    dismiss: true,
    preventScroll: true,
    confirm: `[${DATA_UI_PREFIX + CONFIRM}],[${
      DATA_UI_PREFIX + CONFIRM
    }="${DIALOG}"]`,
    title: getDataSelector(DIALOG, ARIA_SUFFIX[ARIA_LABELLEDBY]),
    description: getDataSelector(DIALOG, ARIA_SUFFIX[ARIA_DESCRIBEDBY]),
    group: "",
    awaitAnimation: false,
    [CONTENT]: getDataSelector(DIALOG, CONTENT),
    [BACKDROP]: getDataSelector(DIALOG, BACKDROP),
    [TOGGLER]: true,
    [TOGGLER + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [DIALOG + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [CONTENT + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,
    [BACKDROP + CLASS_ACTIVE_SUFFIX]: CLASS_ACTIVE,

    [OPTION_AUTODESTROY]: false,

    autofocus: true,
    focusTrap: true,

    modal: true,
    topLayer: true,
    root: BODY,
    moveToRoot: true,
  };

  constructor(elem, opts) {
    super(elem, opts);
  }

  _update() {
    const { base, opts, id, on } = this;
    updateOptsByData(
      opts,
      base,
      [
        MODAL,
        BACKDROP,
        OPTION_TOP_LAYER,
        OPTION_PREVENT_SCROLL,
        OPTION_HASH_NAVIGATION,
        HIDE_MODE,
        OPTION_GROUP,
        OPTION_AUTODESTROY,
        OPTION_MOVE_TO_ROOT,
      ],
      [
        MODAL,
        OPTION_TOP_LAYER,
        OPTION_MOVE_TO_ROOT,
        OPTION_PREVENT_SCROLL,
        OPTION_HASH_NAVIGATION,
        OPTION_AUTODESTROY,
      ],
    );
    updateModule(this, OPTION_GROUP, NAME);

    let backdrop;
    if (isString(opts[BACKDROP])) {
      backdrop = (opts[BACKDROP][0] === "#" ? doc : base).querySelector(
        opts[BACKDROP],
      );
    }

    this[BACKDROP] = backdrop;

    this[CONTENT] = getOptionElem(this, opts[CONTENT], base);

    const isDialogElem = isDialog(base);

    this[TELEPORT] = Teleport.createOrUpdate(
      this[TELEPORT],
      base,
      opts.moveToRoot ? opts.root : false,
      {
        disableAttributes: true,
      },
    )?.move(this);

    if (opts[HIDE_MODE] === ACTION_REMOVE && base[HIDDEN]) {
      toggleHideModeState(false, this);
    }

    this[TRANSITION] = Transition.createOrUpdate(
      this[TRANSITION],
      this[CONTENT],
      opts[TRANSITION],
    );

    this._togglers =
      opts.toggler === true ? getDefaultToggleSelector(id) : opts.toggler;

    if (isDialogElem) {
      on(base, CANCEL + UI_EVENT_PREFIX, (e) => e.preventDefault());
    } else if (opts.a11y) {
      base[TABINDEX] = -1;
      setAttribute(base, ROLE, DIALOG);
    }

    base.popover =
      opts.topLayer && (!isDialogElem || !opts.modal) && POPOVER_API_SUPPORTED
        ? POPOVER_API_MODE_MANUAL
        : null;

    addHashNavigation(this);
    addDismiss(this);
  }
  init() {
    const { opts, isInit, base, on, emit, hide, toggle } = this;

    if (isInit) return;

    this.base.id = this.id;

    emit(EVENT_BEFORE_INIT);

    this._update();
    this.updateAriaTargets();

    on(
      base,
      [
        EVENT_CLICK,
        opts.backdropHide &&
          (opts.backdropHide?.rightClick ?? true) &&
          EVENT_RIGHT_CLICK,
      ],
      (event) => {
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

    return callShowInit(this);
  }
  destroy(destroyOpts) {
    if (!this.isInit) return;

    removeClass(this._togglers, this.opts[TOGGLER + CLASS_ACTIVE_SUFFIX]);
    [DIALOG, CONTENT, BACKDROP].forEach((name) =>
      removeClass(this[name], this.opts[name + CLASS_ACTIVE_SUFFIX]),
    );

    this.focusGuards?.destroy();
    this.focusGuards = null;
    this.placeholder?.replaceWith(this.base);

    this.isOpen = false;

    this[DIALOG].hidePopover?.();
    this[DIALOG].close?.();
    this[DIALOG].popover = null;

    this.preventScroll(false);

    this.opts.a11y &&
      removeAttribute(
        this.base,
        TABINDEX,
        ROLE,
        ARIA_LABELLEDBY,
        ARIA_DESCRIBEDBY,
      );

    baseDestroy(this, destroyOpts);
    return this;
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
      base,
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
      ignoreConditions,
      ignoreAutofocus,
      __initial,
    } = normalizeToggleParameters(params);

    s = !!(s ?? !isOpen);

    if (
      !ignoreConditions &&
      ((opts.awaitAnimation && isAnimating) || s === isOpen)
    )
      return;

    let groupClosingFinish;
    if (!s && opts.group) {
      this.groupClosing = new Promise((resolve) => {
        groupClosingFinish = resolve;
      });
    }

    if (isAnimating && !opts.awaitAnimation) {
      await this[TRANSITION]?.cancel();
    }

    const eventParams = { trigger, event };

    !silent && emit(s ? EVENT_BEFORE_SHOW : EVENT_BEFORE_HIDE, eventParams);

    if (
      !s &&
      opts.preventHide &&
      (isFunction(opts.preventHide)
        ? !(await opts.preventHide(this, eventParams))
        : opts.preventHide)
    ) {
      this.groupClosing = false;
      return emit(EVENT_HIDE_PREVENTED, eventParams);
    }

    this.isOpen = s;

    toggleConfirm(s, this);

    const backdropIsOpen = Dialog.shownDialogs.find(
      (instance) => instance !== this && instance[BACKDROP] === backdrop,
    );

    const shownGroupDialogs = this.shownGroupDialogs;
    if (s) {
      if (shownGroupDialogs.length > 1) {
        const promises = Promise.allSettled(
          shownGroupDialogs
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
    } else if (!s && !shownGroupDialogs.length) {
      optReturnFocusAwait = false;
    }

    s && toggleHideModeState(true, this);

    !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

    const promise = this[TRANSITION]?.run(s, animated);

    if (s) {
      if (opts.returnFocus) {
        this.returnFocusElem ||= doc.activeElement;
      }
      this._toggleApi(true);
    }

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

    if (__initial && !animated && backdrop) {
      backdrop.style.transition = NONE;
      backdrop.offsetWidth;
      backdrop.style.transition = "";
    }

    this.preventScroll(s);

    if (!s && !optReturnFocusAwait) {
      this._toggleApi(false);
      this.returnFocus();
    }

    opts.escapeHide && addEscapeHide(this, s, base);

    if (s) {
      !ignoreAutofocus && opts.autofocus && callAutofocus(this);
      on(content, EVENT_MOUSEDOWN + UI_EVENT_PREFIX, (e) => {
        this._mousedownTarget = e.target;
      });
    } else {
      this._mousedownTarget = null;
      off(content, EVENT_MOUSEDOWN + UI_EVENT_PREFIX);
      this.returnFocusElem = null;
    }

    awaitPromise(promise, () => {
      if (!s) {
        if (optReturnFocusAwait) {
          this._toggleApi(false);
          this.returnFocus();
        }
        toggleHideModeState(false, this);
      }

      !silent && emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);

      if (!s) {
        opts[OPTION_AUTODESTROY] && this.destroy({ remove: true });
        this.groupClosing = false;
        groupClosingFinish?.();
      }
    });

    animated && opts.awaitAnimation && (await promise);

    return this;
  }
  _toggleApi(s) {
    const { base, opts } = this;
    const baseIsDialog = isDialog(base);
    if (s) {
      const isModal = baseIsDialog && opts.modal;
      const isPopover = opts.topLayer && POPOVER_API_SUPPORTED;

      if (baseIsDialog) {
        if (isModal) {
          if (base.open) base.close();
          base.showModal();
          Dialog.dispatchTopLayer(MODAL);
        } else {
          if (isPopover) {
            base.showPopover();
            base.open = true;
            Dialog.dispatchTopLayer(POPOVER);
          } else {
            base.show();
          }
        }
      } else if (isPopover) {
        base.showPopover();
        Dialog.dispatchTopLayer(POPOVER);
      }
      if (opts.focusTrap && !isModal) {
        this.focusGuards = new FocusGuards(base);
      }
    } else {
      base.close?.();
      base.popover && base.hidePopover();
      if (this.focusGuards) {
        this.focusGuards?.destroy();
        this.focusGuards = null;
      }
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
