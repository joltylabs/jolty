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
  DATA_PREFIX,
  UI_PREFIX,
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
  UI,
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

ResetFloatingCssVariables();

const DIALOG_MODE = MODAL + "-" + POPOVER;

export default class Floating {
  constructor({ target, anchor, arrow, opts, name = "" }) {
    const { on, off } = new EventHandler();
    Object.assign(this, { target, anchor, arrow, opts, name, on, off });
  }
  recalculate() {
    const { target, anchor, arrow, opts, name } = this;
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
    topLayer = topLayer ? topLayer === TRUE : opts.topLayer;
    placement ||= opts[PLACEMENT];
    mode ||= opts[MODE];

    const wrapper = this.createWrapper(mode, topLayer);
    const wrapperStyle = wrapper.style;
    const inTopLayer =
      (topLayer && POPOVER_API_SUPPORTED) || mode === DIALOG_MODE;

    const {
      padding,
      offset = opts.offset,
      boundaryOffset = opts.boundaryOffset,
      arrowPadding = opts[ARROW]?.padding ?? 0,
      arrowOffset = opts[ARROW]?.offset ?? 0,
      wrapperComputedStyle,
    } = collectCssVariables(anchorStyles, targetStyles, wrapper, PREFIX);

    const absolute = true;
    let anchorRect = getBoundingClientRect(anchor, !absolute);

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
      absolute,
      flip,
      sticky,
      shrink,
      offset,
      boundaryOffset,
      padding,
      minHeight: parseFloat(targetStyles.minHeight),
      minWidth: parseFloat(targetStyles.minWidth),
    };

    let prevTop = 0;
    let pendingUpdate = false;
    const updatePosition = () => {
      if (pendingUpdate) return;
      pendingUpdate = true;

      anchorRect = getBoundingClientRect(anchor, true);
      if (absolute && !inTopLayer) {
        anchorRect.left = anchor.offsetLeft;
        anchorRect.top = anchor.offsetTop;
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

    if (mode === DIALOG_MODE) {
      wrapper.showModal();
      if (opts.escapeHide) {
        this.on(wrapper, CANCEL, (e) => e.preventDefault());
      } else {
        this.off(wrapper, CANCEL);
      }
    } else if (topLayer && POPOVER_API_SUPPORTED) {
      wrapper.showPopover();
    }

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

  createWrapper(mode, topLayer) {
    const {
      target,
      name,
      anchor,
      opts: { interactive },
    } = this;
    const attributes = {
      style: {
        position: ABSOLUTE,
        left: 0,
        top: 0,
        zIndex: 999,
        margin: 0,
        padding: 0,
        background: NONE,
        maxWidth: NONE,
        maxHeight: NONE,
        willChange: "transform",
        width: "fit-content",
        height: "fit-content",
        minWidth: "max-content",
        display: "block",
        overflow: "unset",
      },
      [FLOATING_DATA_ATTRIBUTE]: name,
      [DATA_UI_PREFIX + "current-" + MODE]: mode,
    };

    if (topLayer && POPOVER_API_SUPPORTED && mode !== DIALOG_MODE) {
      attributes[POPOVER] = "";
    }

    if (interactive !== undefined && !interactive) {
      attributes[INERT] = "";
      attributes.style.pointerEvents = NONE;
    }

    const wrapper = (this.wrapper = createElement(
      mode === DIALOG_MODE ? DIALOG : DIV,
      attributes,
      target,
    ));

    if (topLayer) {
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

    this.wrapper.remove();
  }
}
