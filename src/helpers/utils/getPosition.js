import {
  WIDTH,
  HEIGHT,
  TOP,
  LEFT,
  RIGHT,
  BOTTOM,
  AVAILABLE_WIDTH,
  AVAILABLE_HEIGHT,
  START,
  CENTER,
  END,
  MIRROR,
} from "../constants";
import { isArray } from "../is";
import { createInset } from "./index.js";

const { min, max } = Math;

export default function ({
  absolute,
  anchorRect,
  targetRect,
  arrow,
  placement,
  boundaryOffset = 0,
  offset = 0,
  padding = 0,
  shrink = false,
  flip = true,
  sticky = false,
  minWidth = 0,
  minHeight = 0,
}) {
  boundaryOffset = createInset(boundaryOffset);

  const viewRect = visualViewport;

  // if (absolute) {
  //   flip = false;
  //   shrink = false;
  //   sticky = false;
  // }

  flip = isArray(flip) ? flip : [flip];
  flip[1] ??= flip[0];

  padding = isArray(padding) ? padding : [padding];
  padding[1] ??= padding[0];

  const [baseM, baseS = CENTER] = placement.split("-");
  const hor = baseM === LEFT || baseM === RIGHT;

  const size = hor ? WIDTH : HEIGHT;
  const dir = hor ? LEFT : TOP;
  const dirS = hor ? TOP : LEFT;

  const minRect = { [WIDTH]: minWidth, [HEIGHT]: minHeight };

  let useFlipM = null;
  let useFlipS = null;

  function calculate() {
    const m = (useFlipM && MIRROR[baseM]) || baseM;
    const s = (useFlipS && MIRROR[baseS]) || baseS;

    const isStart = s === START;
    const isEnd = s === END;
    const isCenter = s === CENTER;
    const isMainDir = m === dir;
    const sumPadding = padding[0] + padding[1];
    const mirrorSize = MIRROR[size];
    const mirrorDirS = MIRROR[dirS];

    const anchorSpace = {
      [TOP]: anchorRect[TOP],
      [LEFT]: anchorRect[LEFT],
      [RIGHT]: viewRect[WIDTH] - anchorRect[RIGHT],
      [BOTTOM]: viewRect[HEIGHT] - anchorRect[BOTTOM],
    };

    anchorSpace[m] -= offset + boundaryOffset[m];
    anchorSpace[MIRROR[m]] -= boundaryOffset[dirS] + boundaryOffset[mirrorDirS];

    let awailableSizesOffset;
    if (sticky) {
      awailableSizesOffset = viewRect[mirrorSize] - sumPadding;
    } else {
      awailableSizesOffset = viewRect[mirrorSize] - anchorRect[mirrorSize] / 2;
      if (isStart) {
        awailableSizesOffset =
          anchorSpace[mirrorDirS] + anchorRect[mirrorSize] - sumPadding;
      } else if (isEnd) {
        awailableSizesOffset =
          anchorSpace[dirS] + anchorRect[mirrorSize] - sumPadding;
      }
    }

    const awailableSizes = {
      [size]: max(minRect[size], anchorSpace[m]),
      [mirrorSize]: max(minRect[mirrorSize], awailableSizesOffset),
    };

    const currentSize = {
      [size]: shrink
        ? min(targetRect[size], awailableSizes[size])
        : targetRect[size],
      [mirrorSize]: shrink
        ? min(targetRect[mirrorSize], awailableSizes[mirrorSize])
        : targetRect[mirrorSize],
    };

    if ((flip[0] || flip[1]) && useFlipM === null && useFlipS === null) {
      if (
        flip[0] &&
        targetRect[size] > anchorSpace[m] &&
        anchorSpace[m] < anchorSpace[MIRROR[m]]
      ) {
        useFlipM = true;
      }
      if (
        flip[1] &&
        anchorSpace[mirrorDirS] <
          targetRect[mirrorSize] -
            anchorRect[mirrorSize] +
            padding[0] +
            boundaryOffset[mirrorDirS]
      ) {
        useFlipS = true;
      }
      if (useFlipM || useFlipS) {
        return calculate();
      }
    }

    let mo;
    if (isMainDir) {
      mo = anchorRect[dir] - currentSize[size] - offset;
    } else {
      mo = anchorRect[MIRROR[dir]] + offset;
    }

    let so;
    if (isStart) {
      so = anchorRect[dirS] + padding[0];
    } else if (isCenter) {
      so =
        anchorRect[dirS] -
        (currentSize[mirrorSize] - anchorRect[mirrorSize]) / 2;
    } else {
      so = anchorRect[mirrorDirS] - currentSize[mirrorSize] - padding[1];
    }

    const staticSo = so;
    if (sticky) {
      if (so < boundaryOffset[dirS]) {
        if (!isStart) {
          so = boundaryOffset[dirS];
          if (anchorRect[dirS] < boundaryOffset[dirS] - padding[0]) {
            so = anchorRect[dirS] + padding[0];
          }
        }
      } else if (
        so + currentSize[mirrorSize] + boundaryOffset[mirrorDirS] >
        viewRect[mirrorSize]
      ) {
        if (!isEnd) {
          so -=
            so +
            currentSize[mirrorSize] -
            viewRect[mirrorSize] +
            boundaryOffset[mirrorDirS];
          if (
            anchorSpace[mirrorDirS] <
            -padding[1] + boundaryOffset[mirrorDirS]
          ) {
            so -=
              anchorSpace[mirrorDirS] + padding[1] - boundaryOffset[mirrorDirS];
          }
        }
      }
    }

    const shift = staticSo - so;

    let arrowPosition = {};
    if (arrow) {
      let { padding = 0, offset = 0 } = arrow;
      padding = isArray(padding) ? padding : [padding];
      padding[1] ??= padding[0];

      let so;
      if (isStart) {
        so = padding[0];
      } else if (isCenter) {
        so = currentSize[mirrorSize] / 2 - arrow[mirrorSize] / 2;
      } else {
        so = currentSize[mirrorSize] - padding[1] - arrow[mirrorSize];
      }

      so += shift + max(0, -currentSize[mirrorSize] / 2);
      let mo = -arrow[mirrorSize] / 2 + offset;
      if (isMainDir) {
        mo += currentSize[size];
      }
      arrowPosition = hor ? [mo, so] : [so, mo];
    }

    let transformOrigin;
    if (arrow) {
      transformOrigin = arrowPosition;
    } else {
      const mo = isStart
        ? padding[0]
        : isEnd
        ? currentSize[mirrorSize] - padding[1]
        : currentSize[MIRROR[size]] / 2;
      const so = isMainDir ? currentSize[size] : 0;
      transformOrigin = hor ? [so, mo] : [mo, so];
    }

    return {
      [dir]: mo,
      [dirS]: so,
      [AVAILABLE_WIDTH]: awailableSizes[WIDTH],
      [AVAILABLE_HEIGHT]: awailableSizes[HEIGHT],
      arrow: arrowPosition,
      placement: useFlipM ? MIRROR[placement] : placement,
      transformOrigin,
    };
  }
  return calculate();
}
