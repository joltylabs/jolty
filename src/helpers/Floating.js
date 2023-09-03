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
  body,
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
  TOP_LAYER,
  FIXED,
  EVENT_KEYDOWN,
  FOCUSABLE_ELEMENTS_SELECTOR,
  KEY_TAB,
  POPOVER_API_MODE_MANUAL,
  UI_EVENT_PREFIX,
  FALSE,
  FLOATING,
  CLASS,
  CENTER,
  AUTO,
  CONTENT,
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
} from "./utils";
import { EventHandler } from "./EventHandler";
import {
  getBoundingClientRect,
  getPropertyValue,
  parents,
  setAttribute,
  focus,
} from "./dom";
import { FocusGuards } from "./modules/index.js";
import { isDialog } from "./is/index.js";

ResetFloatingCssVariables();

export default class Floating {
  constructor({
    target,
    anchor,
    arrow,
    opts,
    name = "",
    base,
    onTopLayer,
    defaultTopLayerOpts,
    hide,
    teleport,
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
      onTopLayer,
      defaultTopLayerOpts,
      hide,
      teleport,
    });
  }
  init() {
    const { target, anchor, arrow, opts, name, base, on, defaultTopLayerOpts } =
      this;
    const PREFIX = VAR_UI_PREFIX + name + "-";

    const anchorScrollParents = parents(anchor, isOverflowElement);
    const anchorStyles = getComputedStyle(anchor);
    const targetStyles = getComputedStyle(target);

    let [flip, sticky, shrink, placement, mode, topLayer] = [
      STICKY,
      FLIP,
      SHRINK,
      PLACEMENT,
      MODE,
      TOP_LAYER,
    ].map(
      (name) =>
        getPropertyValue(anchorStyles, PREFIX + name) ||
        getPropertyValue(targetStyles, PREFIX + name),
    );

    flip = flip
      ? flip.split(" ").map((v) => v === TRUE)
      : returnArray(opts[FLIP]);

    sticky = sticky ? sticky === TRUE : opts[STICKY];
    shrink = shrink ? shrink === TRUE : opts[SHRINK];

    if (topLayer !== FALSE) {
      this.topLayer = topLayer = opts[TOP_LAYER] || defaultTopLayerOpts;
    } else {
      this.topLayer = topLayer = false;
    }

    this[PLACEMENT] = placement =
      base.getAttribute(DATA_UI_PREFIX + name + "-" + PLACEMENT) ||
      placement ||
      opts[PLACEMENT];

    this[CLASS] =
      base.getAttribute(DATA_UI_PREFIX + name + "-" + FLOATING + "-" + CLASS) ??
      opts.floatingClass;

    this[MODE] = mode =
      base.getAttribute(DATA_UI_PREFIX + name + "-" + MODE) ||
      mode ||
      opts[MODE];

    const modeIsModal = mode.startsWith(MODAL);

    const usePopoverApi =
      topLayer && !modeIsModal && opts.popoverApi && POPOVER_API_SUPPORTED;

    const inTopLayer =
      (topLayer && (!opts.popoverApi || POPOVER_API_SUPPORTED)) || modeIsModal;

    const moveToRoot =
      topLayer &&
      (!modeIsModal || topLayer.moveModal) &&
      (!usePopoverApi || topLayer.movePopover);

    const useFocusGuards =
      (opts.focusTrap && !modeIsModal) || (usePopoverApi && moveToRoot);

    const wrapper = this.createWrapper(mode, moveToRoot, usePopoverApi);

    if (moveToRoot && !modeIsModal && !opts.focusTrap) {
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

    if (mode === MODAL || mode === DIALOG) {
      this._toggleApi(useFocusGuards);
      return this;
    }

    const wrapperStyle = wrapper.style;

    const {
      padding,
      offset = opts.offset,
      boundaryOffset = opts.boundaryOffset,
      arrowPadding,
      arrowOffset,
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
    if (arrow) {
      arrowData = { [WIDTH]: arrow.offsetWidth, [HEIGHT]: arrow.offsetHeight };
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

      if (arrow) {
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
    return this;
  }

  _toggleApi(useFocusGuards) {
    const { wrapper, opts, mode, topLayer, anchor, target, onTopLayer } = this;
    const wrapperIsDialog = isDialog(wrapper);
    const isModal =
      mode.startsWith(MODAL) && (!opts.safeModal || POPOVER_API_SUPPORTED);
    const isPopover = topLayer && POPOVER_API_SUPPORTED && wrapper.popover;

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
            this.hide?.();
          }
        },
      });
    }
  }

  createWrapper(mode, moveToRoot, usePopoverApi) {
    const { target, name, anchor, opts } = this;

    const style = {
      zIndex: 999,
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
    };

    if (mode === MODAL || mode === DIALOG) {
      style.position = FIXED;
      style.inset = 0;
      style.height = style.width = AUTO;
    } else {
      style.position = ABSOLUTE;
      style.inset = AUTO;
      style.left = 0;
      style.top = 0;
      style.height = style.width = "fit-" + CONTENT;
      style.willChange = "transform";
      style.minWidth = "max-" + CONTENT;
    }

    const attributes = {
      style,
      class: this.class,
      [FLOATING_DATA_ATTRIBUTE]: name,
      [DATA_UI_PREFIX + "current-mode"]: mode,
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
      mode.startsWith(MODAL) || mode.startsWith(DIALOG) ? DIALOG : DIV,
      attributes,
    ));

    if (this.teleport) {
      this.teleport.opts.to = wrapper;
      this.teleport.move();
    }

    if (moveToRoot) {
      body.append(wrapper);
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
    this.focusGuards?.destroy();
    this.wrapper.remove();
    this.teleport.reset();
  }
}
