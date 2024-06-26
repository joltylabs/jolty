import {
  DEFAULT_OPTIONS,
  ROLE,
  CONTENT,
  BACKDROP,
  ARIA_LABELLEDBY,
  ARIA_DESCRIBEDBY,
  TABINDEX,
  STATE_MODE,
  EVENT_SHOW,
  EVENT_HIDE,
  EVENT_CLICK,
  EVENT_HIDE_PREVENTED,
  EVENT_BEFORE_INIT,
  EVENT_HIDDEN,
  EVENT_SHOWN,
  OPTION_GROUP,
  NAME,
  EVENT_BEFORE_HIDE,
  EVENT_BEFORE_SHOW,
  CONFIRM,
  CLASS_ACTIVE,
  TOGGLER,
  CLASS_ACTIVE_SUFFIX,
  DIALOG,
  UI_EVENT_PREFIX,
  OPTION_PREVENT_SCROLL,
  DATA_UI_PREFIX,
  ACTION_REMOVE,
  HIDDEN,
  TRANSITION,
  PRIVATE_OPTION_CANCEL_ON_HIDE,
  OPTION_HASH_NAVIGATION,
  OPTION_AUTODESTROY,
  OPTION_LIGHT_DISMISS,
  UI_PREFIX,
  TOP_LAYER_OPTIONS,
  TOP_LAYER_OPTIONS_NAMES,
  AUTO,
  DISMISS,
  MODAL,
  OPTION_BACK_DISMISS,
  ARIA_SUFFIX,
  AUTOHIDE,
  DURATION,
  EVENT_CLOSE,
  OPTION_TOP_LAYER,
  OPTION_PREVENT_DISMISS,
  EVENT_DISMISS_PREVENTED,
} from "./helpers/constants";
import { isString, isFunction, isDialog, isModal } from "./helpers/is";
import {
  getElements,
  toggleClass,
  removeClass,
  focus,
  closest,
  removeAttribute,
  animateClass,
} from "./helpers/dom";
import {
  arrayFrom,
  getDataSelector,
  normalizeToggleParameters,
  getEventsPrefix,
  getDefaultToggleSelector,
  getOptionElem,
  updateOptsByData,
  awaitPromise,
  resetTransition,
  camelToKebab,
  addStatusClasses,
} from "./helpers/utils";
import {
  addDismiss,
  baseDestroy,
  callAutofocus,
  toggleBackDismiss,
  callShowInit,
  toggleConfirm,
  addHashNavigation,
  toggleStateMode,
  updateModule,
  togglePreventScroll,
  FocusGuards,
  addAriaTargets,
  addFrameState,
  toggleLightDismiss,
} from "./helpers/modules";
import Base from "./helpers/Base";
import ToggleMixin from "./helpers/ToggleMixin.js";
import Transition from "./helpers/Transition.js";
import Teleport from "./helpers/Teleport.js";
import {
  addPopoverAttribute,
  destroyTopLayer,
  toggleTopLayer,
} from "./helpers/modules/toggleTopLayer.js";
import Autoaction from "./helpers/Autoaction.js";

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
      backdrop = (opts[BACKDROP][0] === "#" ? document : base).querySelector(
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
        this.returnFocusElem ||= document.activeElement;
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

export default Dialog;
