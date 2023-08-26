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
} from "./dom";
import { FocusGuards } from "./modules/index.js";

ResetFloatingCssVariables();

export default class Floating {
  constructor({ target, anchor, arrow, opts, name = "", base }) {
    const { on, off } = new EventHandler();
    Object.assign(this, { target, anchor, arrow, opts, name, on, off, base });
  }
  init() {
    const { target, anchor, arrow, opts, name, base, on } = this;
    const PREFIX = VAR_UI_PREFIX + name + "-";

    const anchorScrollParents = parents(anchor, isOverflowElement);
    const targetStyles = getComputedStyle(target);
    const anchorStyles = getComputedStyle(anchor);

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

    this.topLayer = topLayer = topLayer ? topLayer === TRUE : opts.topLayer;

    this[PLACEMENT] = placement =
      base.getAttribute(DATA_UI_PREFIX + name + "-" + PLACEMENT) ||
      placement ||
      opts[PLACEMENT];

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
      (!modeIsModal || opts.moveModal) &&
      (!usePopoverApi || opts.movePopover);

    const wrapper = this.createWrapper(mode, moveToRoot, usePopoverApi);

    if (moveToRoot && !modeIsModal && !opts.focusTrap) {
      this.on(anchor, EVENT_KEYDOWN, (e) => {
        if (e.keyCode === KEY_TAB && !e.shiftKey) {
          const focusElem = target.querySelector(FOCUSABLE_ELEMENTS_SELECTOR);
          if (focusElem) {
            e.preventDefault();
            focusElem.focus();
          }
        }
      });
    }

    if ((opts.focusTrap && !modeIsModal) || (usePopoverApi && moveToRoot)) {
      this.focusGuards = new FocusGuards(target, {
        focusAfterAnchor: !opts.focusTrap,
        anchor,
        topLayer,
      });
    }

    if (mode === MODAL || mode === DIALOG) {
      this.applyMode();
      return this;
    }

    const wrapperStyle = wrapper.style;

    const {
      padding,
      offset = opts.offset,
      boundaryOffset = opts.boundaryOffset,
      arrowPadding = opts[ARROW]?.padding ?? 0,
      arrowOffset = opts[ARROW]?.offset ?? 0,
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
      arrowData = getBoundingClientRect(arrow);
      arrowData[PADDING] = arrowPadding;
      arrowData[OFFSET] = arrowOffset;
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
        `${DATA_UI_PREFIX}current-placement`,
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

    this.applyMode();

    this.on(anchorScrollParents, EVENT_SCROLL, updatePosition, {
      passive: true,
    });
    this.on(visualViewport, [EVENT_SCROLL, EVENT_RESIZE], updatePosition, {
      passive: true,
    });
    this.on(window, EVENT_SCROLL, updatePosition, {
      passive: true,
    });
    this.updatePosition = updatePosition.bind(this);
    return this;
  }

  applyMode() {
    const { wrapper, opts, mode, topLayer } = this;
    if (mode.startsWith(MODAL)) {
      wrapper.showModal();
      if (opts.escapeHide) {
        this.on(wrapper, CANCEL, (e) => e.preventDefault());
      }
    } else if (topLayer && POPOVER_API_SUPPORTED) {
      wrapper.hasAttribute(POPOVER) && wrapper.showPopover();
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
      width: "auto",
      height: "auto",
      overflow: "unset",
      pointerEvents: "none",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    if (mode === MODAL || mode === DIALOG) {
      style.position = FIXED;
      style.inset = 0;
    } else {
      style.position = ABSOLUTE;
      style.left = 0;
      style.top = 0;
      style.width = "fit-content";
      style.height = "fit-content";
      style.willChange = "transform";
      style.minWidth = "max-content";
    }

    const attributes = {
      style,
      [FLOATING_DATA_ATTRIBUTE]: name,
      [DATA_UI_PREFIX + "current-mode"]: mode,
    };

    if (usePopoverApi) {
      attributes[POPOVER] = "manual";
    }

    if (opts.interactive !== undefined && !opts.interactive) {
      attributes[INERT] = "";
      attributes.style.pointerEvents = NONE;
    } else {
      target.style.pointerEvents = "auto";
    }

    const wrapper = (this.wrapper = createElement(
      mode.startsWith(MODAL) ? DIALOG : DIV,
      attributes,
      target,
    ));

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
    if (this.wrapper.hasAttribute(POPOVER) && POPOVER_API_SUPPORTED) {
      this.wrapper.hidePopover();
    }
    this.focusGuards?.destroy();
    this.wrapper.remove();
  }
}
