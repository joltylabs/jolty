import {
  DEFAULT_OPTIONS,
  ROLE,
  CONTENT,
  BACKDROP,
  ARIA_LABELLEDBY,
  ARIA_DESCRIBEDBY,
  TABINDEX,
  HIDE_MODE,
  EVENT_SHOW,
  EVENT_HIDE,
  EVENT_CLICK,
  EVENT_CONTEXT_MENU_CLICK,
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
  POPOVER_API_MODE_MANUAL,
  DATA_UI_PREFIX,
  ACTION_REMOVE,
  HIDDEN,
  TELEPORT,
  TRANSITION,
  PRIVATE_OPTION_CANCEL_ON_HIDE,
  OPTION_HASH_NAVIGATION,
  OPTION_AUTODESTROY,
  OPTION_MOVE_TO_ROOT,
  BODY,
  OPTION_LIGHT_DISMISS,
  OPTION_BACK_DISMISS,
} from "./helpers/constants";
import {
  isString,
  isElement,
  isFunction,
  isDialog,
  isModal,
} from "./helpers/is";
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
  isClickOutsideElem,
  resetTransition,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  callAutofocus,
  addBackDismiss,
  callShowInit,
  toggleConfirm,
  addHashNavigation,
  toggleHideModeState,
  updateModule,
  togglePreventScroll,
  FocusGuards,
  toggleMouseDownTarget,
} from "./helpers/modules";
import Base from "./helpers/Base";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";
import {
  destroyTopLayer,
  toggleTopLayer,
} from "./helpers/modules/toggleTopLayer.js";

const ARIA_SUFFIX = {
  [ARIA_LABELLEDBY]: TITLE,
  [ARIA_DESCRIBEDBY]: "description",
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
    [OPTION_BACK_DISMISS]: true,
    [OPTION_LIGHT_DISMISS]: true,
    [OPTION_HASH_NAVIGATION]: false,
    returnFocus: true,
    preventHide: false,
    dismiss: true,
    [OPTION_PREVENT_SCROLL]: true,
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

  get main() {
    return this[CONTENT] || this[DIALOG];
  }

  constructor(elem, opts) {
    super(elem, opts);
  }

  _update() {
    const { base, opts, id, on } = this;
    updateOptsByData(
      opts,
      base,
      [
        TRANSITION,
        BACKDROP,
        HIDE_MODE,
        OPTION_GROUP,
        MODAL,
        OPTION_TOP_LAYER,
        OPTION_MOVE_TO_ROOT,
        OPTION_PREVENT_SCROLL,
        OPTION_HASH_NAVIGATION,
        OPTION_AUTODESTROY,
        OPTION_LIGHT_DISMISS,
        OPTION_BACK_DISMISS,
      ],
      [
        MODAL,
        OPTION_TOP_LAYER,
        OPTION_MOVE_TO_ROOT,
        OPTION_PREVENT_SCROLL,
        OPTION_HASH_NAVIGATION,
        OPTION_AUTODESTROY,
        OPTION_LIGHT_DISMISS,
        OPTION_BACK_DISMISS,
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

    this.teleport = Teleport.createOrUpdate(
      this.teleport,
      base,
      opts.moveToRoot ? opts.root : false,
      {
        disableAttributes: true,
      },
    )?.move(this);

    if (opts[HIDE_MODE] === ACTION_REMOVE && base[HIDDEN]) {
      toggleHideModeState(false, this);
    }

    this.transition = Transition.createOrUpdate(
      this.transition,
      this.main,
      opts.transition,
    );

    this._togglers =
      opts.toggler === true ? getDefaultToggleSelector(id) : opts.toggler;

    if (isDialogElem) {
      on(base, CANCEL + UI_EVENT_PREFIX, (e) => e.preventDefault());
    } else if (opts.a11y) {
      base.setAttribute(TABINDEX, -1);
      base.setAttribute(ROLE, DIALOG);
    }

    base.popover =
      opts.topLayer && (!isDialogElem || !opts.modal) && POPOVER_API_SUPPORTED
        ? POPOVER_API_MODE_MANUAL
        : null;

    addHashNavigation(this);
    addDismiss(this);
  }
  init() {
    const { opts, isInit, on, emit, base, toggle } = this;

    if (isInit) return;

    base.id = this.id;

    emit(EVENT_BEFORE_INIT);

    this._update();
    this.updateAriaTargets();

    let isClosing = false;

    on(
      document,
      [
        EVENT_CLICK + UI_EVENT_PREFIX,
        opts[OPTION_LIGHT_DISMISS] &&
          (opts[OPTION_LIGHT_DISMISS]?.contextMenuClick ?? true) &&
          EVENT_CONTEXT_MENU_CLICK + UI_EVENT_PREFIX,
      ],
      (event) => {
        if (
          !this.isOpen ||
          (opts.awaitAnimation && this.transition?.isAnimating)
        )
          return;

        if (opts[OPTION_LIGHT_DISMISS]) {
          let isClickOutside;
          if (this[CONTENT]) {
            isClickOutside =
              !this[CONTENT].contains(event.target) && !this._mousedownTarget;
          } else {
            isClickOutside =
              isClickOutsideElem(base, event) &&
              (!this._mousedownTarget || this._mousedownTarget === base);
          }

          if (isClickOutside) {
            this.hide({ event });
            emit(CANCEL, { event });
          }
        }

        this._mousedownTarget = null;

        isClosing = true;
        requestAnimationFrame(() => (isClosing = false));
      },
    );

    on(document, EVENT_CLICK + UI_EVENT_PREFIX, (event) => {
      if (isClosing) return;
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

    destroyTopLayer(this[DIALOG]);

    togglePreventScroll(this, false);

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
      const id = elem ? (elem.id ||= uuidGenerator()) : elem;
      setAttribute(base, name, id);
    }
    return this;
  }

  async toggle(s, params) {
    const { opts, isOpen, emit, isAnimating, base, content, main, backdrop } =
      this;

    let optReturnFocusAwait =
      opts.returnFocus && (opts.returnFocus?.await ?? opts.group.awaitPrevious);

    const { animated, silent, trigger, event, __initial } =
      normalizeToggleParameters(params);

    s = !!(s ?? !isOpen);

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

    s && toggleHideModeState(true, this);

    !silent && emit(s ? EVENT_SHOW : EVENT_HIDE, eventParams);

    const promise = this.transition?.run(s, animated);

    !animated && this._toggleClasses(s, backdropIsOpen);

    if (s) {
      if (opts.returnFocus) {
        this.returnFocusElem ||= doc.activeElement;
      }
      togglePreventScroll(this, true);
      this._toggleApi(true);
    } else if (!optReturnFocusAwait) {
      this._toggleApi(false, true);
      this.returnFocus();
    }

    animated && this._toggleClasses(s, backdropIsOpen);

    if (__initial && !animated && backdrop) {
      resetTransition(backdrop);
    }

    opts[OPTION_BACK_DISMISS] && addBackDismiss(this, s, base);

    toggleMouseDownTarget(this, main, s);

    if (s) {
      (opts.autofocus || opts.focusTrap) && callAutofocus(this);
    } else {
      this.returnFocusElem = null;
    }

    awaitPromise(promise, () => {
      if (!s) {
        if (optReturnFocusAwait) {
          this.returnFocus();
        }
        this._toggleApi(false);

        toggleHideModeState(false, this);
        togglePreventScroll(this, false);
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
  _toggleApi(s, keepTopLayer) {
    const { opts, base, constructor } = this;

    toggleTopLayer(base, s, {
      modal: opts.modal,
      topLayer: opts.topLayer,
      keepTopLayer,
      constructor,
    });

    if (s && opts.focusTrap && !isModal(base)) {
      this.focusGuards = new FocusGuards(base);
    } else if (!s && this.focusGuards) {
      this.focusGuards?.destroy();
      this.focusGuards = null;
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

export default Dialog;
