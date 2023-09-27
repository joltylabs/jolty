import {
  VAR_UI_PREFIX,
  NONE,
  WIDTH,
  HEIGHT,
  ANCHOR,
  TOP,
  LEFT,
  PX,
  DIV,
  AVAILABLE_WIDTH,
  AVAILABLE_HEIGHT,
  EVENT_SCROLL,
  EVENT_RESIZE,
  FLOATING_DATA_ATTRIBUTE,
  DATA_UI_PREFIX,
  INERT,
  DIALOG,
  ABSOLUTE,
  CANCEL,
  FLIP,
  SHRINK,
  STICKY,
  PLACEMENT,
  PADDING,
  OFFSET,
  ARROW,
  TRUE,
  POPOVER,
  MODAL,
  MODE,
  POPOVER_API_SUPPORTED,
  OPTION_TOP_LAYER,
  FIXED,
  EVENT_KEYDOWN,
  FOCUSABLE_ELEMENTS_SELECTOR,
  KEY_TAB,
  POPOVER_API_MODE_MANUAL,
  UI_EVENT_PREFIX,
  FALSE,
  FLOATING,
  CENTER,
  AUTO,
  CONTENT,
  OPTION_MOVE_TO_ROOT,
  OPTION_FLOATING_CLASS,
} from "./constants";
import {
  createElement,
  getPosition,
  returnArray,
  isOverflowElement,
  observeResize,
  resizeObserver,
  ResetFloatingCssVariables,
  collectCssVariables,
  arrayFrom,
  camelToKebab,
} from "./utils";
import { EventHandler } from "./EventHandler";
import {
  getBoundingClientRect,
  getPropertyValue,
  parents,
  setAttribute,
  focus,
  getElement,
} from "./dom";

import { isDialog } from "./is/index.js";
import FocusGuards from "./modules/FocusGuards.js";

ResetFloatingCssVariables();

const OPTIONS = [
  FLIP,
  STICKY,
  SHRINK,
  PLACEMENT,
  OPTION_TOP_LAYER,
  OPTION_MOVE_TO_ROOT,
];

export default class Floating {
  static instances = new Set();
  constructor({
    target,
    anchor,
    arrow,
    opts,
    name = "",
    base,
    teleport,
    instance,
  }) {
    const { on, off } = new EventHandler();

    Object.assign(this, {
      target,
      anchor,
      arrow,
      opts,
      name,
      on,
      off,
      base,
      teleport,
      instance,
      floatings: new Set(),
    });
  }
  init() {
    const { target, anchor, arrow, opts, name, base, on } = this;
    const PREFIX = VAR_UI_PREFIX + name + "-";

    const anchorScrollParents = parents(anchor, isOverflowElement);
    const anchorStyles = getComputedStyle(anchor);
    const targetStyles = getComputedStyle(target);

    const options = {};
    OPTIONS.map((name) => {
      const variableName = camelToKebab(name);
      return (options[name] =
        getPropertyValue(anchorStyles, PREFIX + variableName) ||
        getPropertyValue(targetStyles, PREFIX + variableName));
    });

    [...OPTIONS, MODE, OPTION_FLOATING_CLASS].forEach((name) => {
      if (name === FLIP) {
        options[FLIP] = options[FLIP]
          ? options[FLIP].split(" ").map((v) => v === TRUE)
          : returnArray(opts[FLIP]);
      } else if (
        name === PLACEMENT ||
        name === MODE ||
        name === OPTION_FLOATING_CLASS
      ) {
        options[name] =
          base.getAttribute(DATA_UI_PREFIX + camelToKebab(name)) ||
          options[name] ||
          opts[PLACEMENT];
      } else {
        options[name] =
          options[name] === TRUE
            ? true
            : options[name] === FALSE
            ? false
            : opts[name];
      }
      this[name] = options[name];
    });

    const { shrink, sticky, topLayer, moveToRoot, flip, placement, mode } =
      this;

    const usePopoverApi = topLayer && mode !== MODAL && POPOVER_API_SUPPORTED;

    const inTopLayer =
      (topLayer && POPOVER_API_SUPPORTED) || mode === MODAL || moveToRoot;

    const useFocusGuards =
      (opts.focusTrap && mode !== MODAL) || (usePopoverApi && moveToRoot);

    const wrapper = this.createWrapper(usePopoverApi);

    if (moveToRoot && mode !== MODAL && !opts.focusTrap) {
      on(anchor, EVENT_KEYDOWN, (e) => {
        if (e.keyCode === KEY_TAB && !e.shiftKey) {
          const focusElem = target.querySelector(FOCUSABLE_ELEMENTS_SELECTOR);
          if (focusElem) {
            e.preventDefault();
            focus(focusElem);
          }
        }
      });
    }

    if (placement === DIALOG) return this;

    const wrapperStyle = wrapper.style;

    const {
      padding,
      offset = opts.offset,
      boundaryOffset = opts.boundaryOffset,
      arrowOffset,
      arrowPadding,
      arrowWidth,
      arrowHeight,
      wrapperComputedStyle,
    } = collectCssVariables(anchorStyles, targetStyles, wrapper, PREFIX);

    let anchorRect = getBoundingClientRect(anchor);

    const targetRect = {};
    [WIDTH, HEIGHT].forEach((size) => {
      targetRect[size] = parseFloat(wrapperComputedStyle[size]);
      wrapperStyle.setProperty(PREFIX + size, targetRect[size] + PX);
      wrapperStyle.setProperty(
        PREFIX + ANCHOR + "-" + size,
        anchorRect[size] + PX,
      );
    });

    let arrowData;
    if (arrow || arrowWidth || arrowHeight) {
      arrowData = {
        [WIDTH]: arrowWidth?.[0] || arrow?.offsetWidth,
        [HEIGHT]: arrowHeight?.[0] || arrow?.offsetHeight,
      };
      arrowData[PADDING] = arrowPadding ?? opts[ARROW]?.padding ?? 0;
      arrowData[OFFSET] = arrowOffset ?? opts[ARROW]?.offset ?? 0;
    }

    const params = {
      anchorRect,
      targetRect,
      arrow: arrowData,
      placement,
      inTopLayer,
      flip,
      sticky,
      shrink,
      offset,
      boundaryOffset,
      padding,
      minHeight: parseFloat(targetStyles.minHeight) || 0,
      minWidth: parseFloat(targetStyles.minWidth) || 0,
    };

    let prevTop = 0;
    let pendingUpdate = false;
    const updatePosition = () => {
      if (pendingUpdate) return;
      pendingUpdate = true;

      anchorRect = getBoundingClientRect(anchor);

      if (!inTopLayer) {
        anchorRect.left = anchorRect.x = anchor.offsetLeft;
        anchorRect.top = anchorRect.y = anchor.offsetTop;
        anchorRect.right = anchor.offsetLeft + anchorRect.width;
        anchorRect.bottom = anchor.offsetTop + anchorRect.height;
      }

      const position = getPosition({ ...params, anchorRect });

      if (inTopLayer) {
        position.top += window.scrollY;
        position.left += window.scrollX;
      }

      if (prevTop && Math.abs(prevTop - position.top) > 50) {
        prevTop = position.top;
        requestAnimationFrame(() => {
          pendingUpdate = false;
        });
        return updatePosition();
      }
      prevTop = position.top;

      setAttribute(
        wrapper,
        DATA_UI_PREFIX + "current-" + PLACEMENT,
        position[PLACEMENT],
      );

      if (shrink) {
        [AVAILABLE_WIDTH, AVAILABLE_HEIGHT].forEach((name) =>
          wrapperStyle.setProperty(PREFIX + name, position[name] + PX),
        );
      }

      if (arrowData) {
        [LEFT, TOP].forEach((dir, i) =>
          wrapperStyle.setProperty(
            PREFIX + ARROW + "-" + dir,
            position.arrow[i] + PX,
          ),
        );
      }
      wrapperStyle.setProperty(
        PREFIX + "transform-origin",
        `${position.transformOrigin[0]}px ${position.transformOrigin[1]}px`,
      );

      wrapperStyle.translate = `${position.left}px ${position.top}px 0`;

      requestAnimationFrame(() => {
        pendingUpdate = false;
      });
    };

    observeResize(target, (width, height) => {
      targetRect[WIDTH] = width;
      targetRect[HEIGHT] = height;
      updatePosition();
    });

    updatePosition();

    this._toggleApi(useFocusGuards);

    on(anchorScrollParents, EVENT_SCROLL, updatePosition, {
      passive: true,
    });
    on(visualViewport, [EVENT_SCROLL, EVENT_RESIZE], updatePosition, {
      passive: true,
    });
    on(window, EVENT_SCROLL, updatePosition, {
      passive: true,
    });
    this.updatePosition = updatePosition.bind(this);

    Floating.instances.add(this);

    this.parentFloating = arrayFrom(Floating.instances).find(
      (floating) => floating !== this && anchor.closest("#" + floating.base.id),
    );
    this.parentFloating?.floatings?.add(this);

    return this;
  }

  _toggleApi(useFocusGuards) {
    const { wrapper, opts, mode, topLayer, anchor, target, instance } = this;
    const wrapperIsDialog = isDialog(wrapper);
    const isModal = mode === MODAL;
    const isPopover = topLayer && POPOVER_API_SUPPORTED && wrapper.popover;

    const onTopLayer = (type) => instance.constructor.dispatchTopLayer(type);

    if (wrapperIsDialog) {
      if (isModal) {
        if (wrapper.open) wrapper.close();
        wrapper.showModal();
        onTopLayer?.(MODAL);
      } else {
        if (isPopover) {
          wrapper.showPopover();
          wrapper.open = true;
          onTopLayer?.(POPOVER);
        } else {
          wrapper.show();
        }
      }
      this.on(wrapper, CANCEL + UI_EVENT_PREFIX, (e) => e.preventDefault());
    } else if (isPopover) {
      wrapper.showPopover();
      onTopLayer?.(POPOVER);
    }

    if (useFocusGuards) {
      this.focusGuards = new FocusGuards(target, {
        focusAfterAnchor: !opts.focusTrap,
        anchor,
        topLayer,
        strategy: ABSOLUTE,
        onFocusOut: () => {
          if (wrapperIsDialog) {
            instance.hide?.();
          }
        },
      });
    }
  }

  createWrapper(usePopoverApi) {
    const { target, name, anchor, opts, placement, mode, moveToRoot } = this;

    const style = {
      zIndex: `var(${VAR_UI_PREFIX}floating-top-layer,999)`,
      margin: 0,
      padding: 0,
      background: NONE,
      maxWidth: NONE,
      maxHeight: NONE,
      overflow: "unset",
      pointerEvents: NONE,
      display: "flex",
      justifyContent: CENTER,
      alignItems: CENTER,
      willChange: "transform",
    };

    if (placement === DIALOG) {
      style.position = FIXED;
      style.inset = 0;
      style.height = AUTO;
      style.width = AUTO;
    } else {
      style.position = ABSOLUTE;
      style.inset = AUTO;
      style.left = 0;
      style.top = 0;
      style.height = style.width = "fit-" + CONTENT;
      style.minWidth = "max-" + CONTENT;
    }

    const attributes = {
      style,
      class: this[OPTION_FLOATING_CLASS],
      [FLOATING_DATA_ATTRIBUTE]: name,
      [DATA_UI_PREFIX + FLOATING + "-" + MODE]: mode,
    };

    if (usePopoverApi) {
      attributes[POPOVER] = POPOVER_API_MODE_MANUAL;
    }

    if (opts.interactive !== undefined && !opts.interactive) {
      attributes[INERT] = "";
      attributes.style.pointerEvents = NONE;
    } else {
      target.style.pointerEvents = AUTO;
    }

    const wrapper = (this.wrapper = createElement(
      mode === MODAL || mode === DIALOG ? DIALOG : DIV,
      attributes,
    ));

    if (this.teleport) {
      this.teleport.opts.to = wrapper;
      this.teleport.move();
    }

    if (moveToRoot) {
      getElement(opts.root)?.append(wrapper);
    } else {
      anchor.after(wrapper);
    }

    return wrapper;
  }
  destroy() {
    this.off();
    resizeObserver.unobserve(this.target);
    this.wrapper.close?.();
    if (this.wrapper.popover && POPOVER_API_SUPPORTED) {
      this.wrapper.hidePopover();
    }
    this.base.style.pointerEvents = "";
    this.focusGuards?.destroy();
    this.wrapper.remove();
    this.teleport.reset();
    Floating.instances.delete(this);
    this.parentFloating?.floatings?.delete(this);
  }
}
