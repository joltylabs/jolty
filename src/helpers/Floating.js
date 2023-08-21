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
  FIXED,
  CANCEL,
  FLIP,
  SHRINK,
  STICKY,
  PLACEMENT,
  PADDING,
  OFFSET,
  BOUNDARY_OFFSET,
  ARROW,
  WEBKIT_PREFIX,
  CLIP_PATH,
  ARROW_OFFSET,
  ARROW_PADDING,
  TRUE,
  TOOLTIP,
  DROPDOWN,
  POPOVER,
  STYLE,
  doc,
  RIGHT,
  BOTTOM,
  MODAL,
} from "./constants";
import {
  createElement,
  kebabToCamel,
  createInset,
  getPosition,
  returnArray,
  isOverflowElement,
  observeResize,
  resizeObserver,
} from "./utils";
import { EventHandler } from "./EventHandler";
import { parents, setAttribute } from "./dom";

const CLIP_PATH_PROPERTY = CSS.supports(CLIP_PATH + ":" + NONE)
  ? CLIP_PATH
  : WEBKIT_PREFIX + CLIP_PATH;
const valuesToArray = ({ value }) => value.trim().split(" ").map(parseFloat);
const registerProperty = CSS.registerProperty;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const getBoundingClientRect = (elem, useScale) => {
  const rect = elem.getBoundingClientRect().toJSON();

  if (!useScale) return rect;

  const vV = visualViewport;
  const hasScale = vV.scale > 1.01 || vV.scale < 0.99;
  const iosScale = window.innerWidth / document.documentElement.clientWidth;
  const hasIosScale = iosScale > 1.01 || iosScale < 0.99;
  const keyboardOpen = vV.height !== window.innerHeight;

  if (
    (!hasScale && hasIosScale) ||
    (keyboardOpen && hasScale && hasIosScale) ||
    (!hasScale && keyboardOpen && isIOS)
  ) {
    rect[TOP] += vV.offsetTop;
    rect[LEFT] += vV.offsetLeft;
    rect[RIGHT] = rect[LEFT] + rect[WIDTH];
    rect[BOTTOM] = rect[TOP] + rect[HEIGHT];
  }

  return rect;
};

let css = "";
[TOOLTIP, DROPDOWN, POPOVER].forEach((name) => {
  const PREFIX = VAR_UI_PREFIX + name + "-";
  [
    STICKY,
    FLIP,
    SHRINK,
    PLACEMENT,
    PADDING,
    OFFSET,
    BOUNDARY_OFFSET,
    ARROW_OFFSET,
    ARROW_PADDING,
  ].forEach((prop) => {
    if (registerProperty) {
      registerProperty({
        name: PREFIX + prop,
        syntax: "*",
        inherits: false,
      });
    } else {
      css += PREFIX + prop + ":;";
    }
  });
});
if (!registerProperty) {
  doc.head.appendChild(createElement(STYLE, false, `*{${css}}`));
}

const DIALOG_MODE = MODAL + "-" + POPOVER;

export default class Floating {
  constructor({ target, anchor, arrow, opts, root = body, name = "" }) {
    const { on, off } = new EventHandler();
    Object.assign(this, { target, anchor, arrow, opts, root, name, on, off });
  }
  recalculate() {
    const { target, anchor, arrow, opts, name } = this;
    const anchorScrollParents = parents(anchor, isOverflowElement);
    const targetStyles = getComputedStyle(target);
    const anchorStyles = getComputedStyle(anchor);
    const PREFIX = VAR_UI_PREFIX + name + "-";
    let pendingUpdate = false;

    const minHeight = parseFloat(targetStyles.minHeight);
    const minWidth = parseFloat(targetStyles.minWidth);

    let [sticky, flip, shrink, placement] = [
      STICKY,
      FLIP,
      SHRINK,
      PLACEMENT,
    ].map(
      (name) =>
        anchorStyles.getPropertyValue(PREFIX + name).trim() ||
        targetStyles.getPropertyValue(PREFIX + name).trim(),
    );

    flip = flip
      ? flip.split(" ").map((v) => v === TRUE)
      : returnArray(opts[FLIP]);
    sticky = sticky ? sticky === TRUE : opts[STICKY];
    shrink = shrink ? shrink === TRUE : opts[SHRINK];

    placement ||= opts[PLACEMENT];

    const absolute = opts.mode === ABSOLUTE;
    const valuesNames = [
      PADDING,
      OFFSET,
      BOUNDARY_OFFSET,
      ARROW_OFFSET,
      ARROW_PADDING,
    ];
    const values = valuesNames
      .map((name) => {
        let value = targetStyles.getPropertyValue(PREFIX + name).trim();
        if (!value) return;
        value = value.split(" ");
        if (name === BOUNDARY_OFFSET) {
          value = createInset(value, true);
        } else {
          value[1] ??= value[0];
        }
        return { name, value };
      })
      .filter(Boolean);

    const polygonValues = values
      .map(({ name, value }) => {
        if (name === BOUNDARY_OFFSET) {
          const valueEnd = value.splice(2).join(" ");
          value = value.join(" ");
          return [value, valueEnd].join(",");
        }
        return value.join(" ");
      })
      .join(",");

    const wrapper = this.createWrapper(
      values.length
        ? { [CLIP_PATH_PROPERTY]: `polygon(${polygonValues})` }
        : {},
    );
    const wrapperComputedStyle = getComputedStyle(this.wrapper);
    const wrapperStyle = wrapper.style;

    const computedValues = wrapperComputedStyle[CLIP_PATH_PROPERTY].slice(8, -1)
      .split(",")
      .values();

    const {
      padding,
      offset = opts.offset,
      boundaryOffset = opts.boundaryOffset,
      arrowPadding = opts[ARROW]?.padding ?? 0,
      arrowOffset = opts[ARROW]?.offset ?? 0,
    } = values.length
      ? Object.fromEntries(
          values.map(({ name }) => {
            let value = valuesToArray(computedValues.next());
            if (name === BOUNDARY_OFFSET) {
              value = [...value, ...valuesToArray(computedValues.next())];
            } else if (name === OFFSET || name === ARROW_OFFSET) {
              value = value[0];
            }
            return [kebabToCamel(name), value];
          }),
        )
      : {};

    if (values.length) {
      wrapperStyle.removeProperty(CLIP_PATH_PROPERTY);
    }

    const arrowRect = arrow && getBoundingClientRect(arrow);
    let anchorRect = getBoundingClientRect(arrow, !absolute);

    const targetRect = {};
    [WIDTH, HEIGHT].forEach((size) => {
      targetRect[size] = parseFloat(wrapperComputedStyle[size]);
      wrapperStyle.setProperty(PREFIX + size, targetRect[size] + PX);
      wrapperStyle.setProperty(
        PREFIX + ANCHOR + "-" + size,
        anchorRect[size] + PX,
      );
    });

    const arrowData = arrow && {
      [WIDTH]: arrowRect[WIDTH],
      [HEIGHT]: arrowRect[HEIGHT],
      [PADDING]: arrowPadding,
      [OFFSET]: arrowOffset,
    };

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
      minHeight,
      minWidth,
    };

    const updatePosition = () => {
      if (pendingUpdate) return;
      pendingUpdate = true;

      anchorRect = getBoundingClientRect(anchor, !absolute);

      if (absolute) {
        anchorRect.left = anchor.offsetLeft;
        anchorRect.top = anchor.offsetTop;
        anchorRect.right = anchor.offsetLeft + anchorRect.width;
        anchorRect.bottom = anchor.offsetTop + anchorRect.height;
      }

      const position = getPosition({ ...params, anchorRect });

      setAttribute(
        wrapper,
        DATA_UI_PREFIX + "current-" + PLACEMENT,
        position.placement,
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
        position.transformOrigin[0] +
          PX +
          " " +
          position.transformOrigin[1] +
          PX,
      );

      wrapperStyle.transform = `translate3d(${position.left}px,${position.top}px,0)`;

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

    this.on(
      anchorScrollParents,
      EVENT_SCROLL,
      () => {
        updatePosition();
      },
      {
        passive: true,
      },
    );
    this.on(visualViewport, [EVENT_SCROLL, EVENT_RESIZE], updatePosition, {
      passive: false,
    });
    this.on(window, EVENT_SCROLL, updatePosition, {
      passive: true,
    });
    this.updatePosition = updatePosition.bind(this);
    return this;
  }

  createWrapper(style = {}) {
    const {
      target,
      root,
      name,
      on,
      off,

      opts: { mode, interactive, focusTrap, escapeHide },
    } = this;
    const attributes = {
      style: {
        position: mode === ABSOLUTE ? ABSOLUTE : FIXED,
        top: 0,
        left: 0,
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
        ...style,
      },
      [FLOATING_DATA_ATTRIBUTE]: "",
      [DATA_PREFIX + UI_PREFIX + name + "-wrapper"]: "",
    };

    if (interactive !== undefined && !interactive) {
      attributes[INERT] = "";
      attributes.style.pointerEvents = NONE;
    }
    const wrapper = (this.wrapper = createElement(
      mode === DIALOG_MODE ? DIALOG : DIV,
      attributes,
      target,
    ));
    root.append(wrapper);
    if (mode === DIALOG_MODE) {
      if (focusTrap) {
        wrapper.showModal();
      } else {
        wrapper.show();
      }
      if (escapeHide) {
        on(wrapper, CANCEL, (e) => e.preventDefault());
      } else {
        off(wrapper, CANCEL);
      }
    }
    return wrapper;
  }
  destroy() {
    this.off();
    resizeObserver.unobserve(this.target);
    this.wrapper.close?.();
    this.wrapper.remove();
  }
}
