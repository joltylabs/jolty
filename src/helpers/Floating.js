import {
  VAR_UI_PREFIX,
  WIDTH,
  HEIGHT,
  ANCHOR,
  TOP,
  LEFT,
  PX,
  AVAILABLE_WIDTH,
  AVAILABLE_HEIGHT,
  EVENT_SCROLL,
  EVENT_RESIZE,
  DATA_UI_PREFIX,
  DIALOG,
  ABSOLUTE,
  FLIP,
  SHRINK,
  STICKY,
  PLACEMENT,
  PADDING,
  OFFSET,
  ARROW,
  TRUE,
  POPOVER_API_SUPPORTED,
  OPTION_TOP_LAYER,
  EVENT_KEYDOWN,
  FOCUSABLE_ELEMENTS_SELECTOR,
  KEY_TAB,
  FALSE,
  OPTION_MOVE_TO_ROOT,
  FLOATING,
} from "./constants";
import {
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
  isRtl,
  removeAttribute,
} from "./dom";

import { isDialog } from "./is/index.js";
import FocusGuards from "./modules/FocusGuards.js";
import { toggleTopLayer } from "./modules/toggleTopLayer.js";

ResetFloatingCssVariables();

const OPTIONS = [
  FLIP,
  STICKY,
  SHRINK,
  PLACEMENT,
  OPTION_TOP_LAYER,
  OPTION_MOVE_TO_ROOT,
];

const CURRENT_PLACEMENT_ATTRIBUTE = DATA_UI_PREFIX + "current-" + PLACEMENT;
const TRANSFORM_ORIGIN = "transform-origin";
const CSS_VARIABLES = [
  LEFT,
  TOP,
  AVAILABLE_WIDTH,
  AVAILABLE_HEIGHT,
  WIDTH,
  HEIGHT,
  ARROW + "-" + LEFT,
  ARROW + "-" + TOP,
  ANCHOR + "-" + WIDTH,
  ANCHOR + "-" + HEIGHT,
  TRANSFORM_ORIGIN,
].map((name) => VAR_UI_PREFIX + FLOATING + "-" + name);

export default class Floating {
  static instances = new Set();
  constructor({ target, anchor, arrow, opts, name = "", base, instance }) {
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
      instance,
      floatings: new Set(),
    });
  }
  init() {
    const { target, anchor, arrow, opts, base, name, on, instance } = this;
    const PREFIX = VAR_UI_PREFIX + name + "-";
    const FLOATING_PREFIX = VAR_UI_PREFIX + FLOATING + "-";

    target.setAttribute(DATA_UI_PREFIX + FLOATING, name);

    const anchorScrollParents = parents(anchor, isOverflowElement);
    const anchorStyles = getComputedStyle(anchor);
    const targetStyles = getComputedStyle(target);

    const options = {};
    OPTIONS.forEach((name) => {
      const variableName = camelToKebab(name);
      return (options[name] =
        getPropertyValue(anchorStyles, PREFIX + variableName) ||
        getPropertyValue(targetStyles, PREFIX + variableName));
    });

    OPTIONS.forEach((name) => {
      if (name === FLIP) {
        options[FLIP] = options[FLIP]
          ? options[FLIP].split(" ").map((v) => v === TRUE)
          : returnArray(opts[FLIP]);
      } else if (name === PLACEMENT) {
        options[name] =
          base.getAttribute(DATA_UI_PREFIX + camelToKebab(name)) ||
          options[name] ||
          opts[name];
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

    const { shrink, sticky, topLayer, moveToRoot, flip, placement } = this;

    const targetIsModal = opts.modal && isDialog(target);

    const usePopoverApi = topLayer && !targetIsModal && POPOVER_API_SUPPORTED;

    const inTopLayer =
      (topLayer && POPOVER_API_SUPPORTED) || targetIsModal || moveToRoot;

    const useFocusGuards =
      (opts.focusTrap && !targetIsModal) || (usePopoverApi && moveToRoot);

    if (moveToRoot && !targetIsModal && !opts.focusTrap) {
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

    toggleTopLayer(this.instance, true);

    if (placement === DIALOG) {
      setAttribute(target, CURRENT_PLACEMENT_ATTRIBUTE, DIALOG);
      return this;
    }

    const {
      padding,
      offset = opts.offset,
      boundaryOffset = opts.boundaryOffset,
      arrowOffset,
      arrowPadding,
      arrowWidth,
      arrowHeight,
    } = collectCssVariables(anchorStyles, targetStyles, target, PREFIX);

    let anchorRect = getBoundingClientRect(anchor);

    const targetRect = {
      [WIDTH]: target.offsetWidth,
      [HEIGHT]: target.offsetHeight,
    };
    [WIDTH, HEIGHT].forEach((size) => {
      target.style.setProperty(FLOATING_PREFIX + size, targetRect[size] + PX);
      target.style.setProperty(
        FLOATING_PREFIX + ANCHOR + "-" + size,
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
      isRtl: isRtl(anchor),
    };

    let prevTop = 0;
    const updatePosition = () => {
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

        return updatePosition();
      }
      prevTop = position.top;

      setAttribute(target, CURRENT_PLACEMENT_ATTRIBUTE, position[PLACEMENT]);

      if (shrink) {
        [AVAILABLE_WIDTH, AVAILABLE_HEIGHT].forEach((name) =>
          target.style.setProperty(FLOATING_PREFIX + name, position[name] + PX),
        );
      }

      [LEFT, TOP].forEach((dir, i) => {
        target.style.setProperty(FLOATING_PREFIX + dir, position[dir] + PX);
        if (arrowData) {
          target.style.setProperty(
            FLOATING_PREFIX + ARROW + "-" + dir,
            position.arrow[i] + PX,
          );
        }
      });

      target.style.setProperty(
        FLOATING_PREFIX + TRANSFORM_ORIGIN,
        `${position.transformOrigin[0]}px ${position.transformOrigin[1]}px`,
      );
    };

    observeResize(target, (width, height) => {
      targetRect[WIDTH] = width;
      targetRect[HEIGHT] = height;
      updatePosition();
    });

    updatePosition();

    toggleTopLayer(instance, true);

    if (useFocusGuards) {
      this.focusGuards = new FocusGuards(target, {
        focusAfterAnchor: !opts.focusTrap,
        anchor,
        topLayer,
        strategy: ABSOLUTE,
        onFocusOut:
          isDialog(target) &&
          (() => {
            instance.hide?.();
          }),
      });
    }

    on([anchorScrollParents, window], EVENT_SCROLL, updatePosition, {
      passive: true,
    });
    on(visualViewport, [EVENT_SCROLL, EVENT_RESIZE], updatePosition, {
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

  destroy() {
    const { target } = this;
    this.off();
    resizeObserver.unobserve(target);

    removeAttribute(
      target,
      DATA_UI_PREFIX + FLOATING,
      CURRENT_PLACEMENT_ATTRIBUTE,
    );

    toggleTopLayer(this.instance, false);

    CSS_VARIABLES.forEach((name) => target.style.removeProperty(name));

    this.focusGuards?.destroy();

    Floating.instances.delete(this);
    this.parentFloating?.floatings?.delete(this);
  }
}
