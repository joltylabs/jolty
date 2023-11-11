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
} from "../../constants/index.js";
import isArray from "../../is/isArray.js";
import createInset from "./createInset.js";

const { min, max } = Math;
const viewRect = visualViewport;

export default function ({
  anchorRect,
  targetRect,
  arrow,
  placement,
  inTopLayer,
  boundaryOffset = 0,
  offset = 0,
  padding = 0,
  shrink = false,
  flip = false,
  sticky = false,
  minWidth = 0,
  minHeight = 0,
  border,
  isRtl = false,
}) {
  boundaryOffset = createInset(boundaryOffset, false, isRtl);

  flip = isArray(flip) ? flip : [flip];
  flip[1] ??= flip[0];

  padding = isArray(padding) ? padding : [padding];
  padding[1] ??= padding[0];

  if (sticky) {
    flip[1] = false;
  }

  if (!inTopLayer) {
    shrink = false;
    flip = false;
    sticky = false;
  }

  let [baseM, baseS = CENTER] = placement.split("-");

  if (baseM === START) {
    baseM = isRtl ? RIGHT : LEFT;
  } else if (baseM === END) {
    baseM = isRtl ? LEFT : RIGHT;
  }

  const hor = baseM === LEFT || baseM === RIGHT;

  if (isRtl && !hor) {
    baseS = MIRROR[baseS];
  }

  const size = hor ? WIDTH : HEIGHT;
  const dir = hor ? LEFT : TOP;
  const dirS = hor ? TOP : LEFT;

  const minRect = { [WIDTH]: minWidth, [HEIGHT]: minHeight };

  let useFlipM = null;
  let useFlipS = null;

  const hasScale =
    viewRect.scale !== 1 && Math.abs(window.innerWidth - viewRect.width) > 2;

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
      [RIGHT]: viewRect[WIDTH] - anchorRect[LEFT] - anchorRect[WIDTH],
      [BOTTOM]: viewRect[HEIGHT] - anchorRect[TOP] - anchorRect[HEIGHT],
    };

    if (hasScale) {
      anchorSpace[TOP] -= viewRect.offsetTop;
      anchorSpace[LEFT] -= viewRect.offsetLeft;
      anchorSpace[RIGHT] += viewRect.offsetLeft;
      anchorSpace[BOTTOM] += viewRect.offsetTop;
    }

    const pageOffset = hasScale
      ? hor
        ? viewRect.offsetTop
        : viewRect.offsetLeft
      : 0;

    anchorSpace[m] -= offset + boundaryOffset[m];
    anchorSpace[MIRROR[m]] -= boundaryOffset[dirS] + boundaryOffset[mirrorDirS];

    const sumBoundaryOffsetS =
      boundaryOffset[mirrorDirS] + boundaryOffset[dirS];

    let availableSizesOffset;
    if (sticky) {
      availableSizesOffset =
        viewRect[mirrorSize] - sumPadding - sumBoundaryOffsetS;
    } else {
      availableSizesOffset = viewRect[mirrorSize] - anchorRect[mirrorSize] / 2;
      if (isStart) {
        availableSizesOffset =
          anchorSpace[mirrorDirS] +
          anchorRect[mirrorSize] -
          sumPadding -
          boundaryOffset[mirrorDirS];
      } else if (isEnd) {
        availableSizesOffset =
          anchorSpace[dirS] +
          anchorRect[mirrorSize] -
          sumPadding -
          boundaryOffset[dirS];
      }
    }

    const availableSizes = {
      [size]: max(minRect[size], anchorSpace[m]),
      [mirrorSize]: max(minRect[mirrorSize], availableSizesOffset),
    };

    const currentSize = {
      [size]: shrink
        ? min(targetRect[size], availableSizes[size])
        : targetRect[size],
      [mirrorSize]: shrink
        ? min(targetRect[mirrorSize], availableSizes[mirrorSize])
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

      const targetOffset =
        anchorSpace[isStart ? mirrorDirS : dirS] +
        anchorRect[mirrorSize] -
        targetRect[mirrorSize] -
        padding[isStart ? 0 : 1] -
        boundaryOffset[isStart ? mirrorDirS : dirS];

      if (flip[1] && targetOffset < 0) {
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
        (targetRect[mirrorSize] - anchorRect[mirrorSize]) / 2;
    } else {
      so = anchorRect[mirrorDirS] - targetRect[mirrorSize] - padding[1];
    }

    const staticSo = so;

    if (sticky) {
      if (so < boundaryOffset[dirS] + pageOffset) {
        if (!isStart) {
          so = boundaryOffset[dirS] + pageOffset;
          if (
            anchorRect[dirS] - pageOffset <
            boundaryOffset[dirS] - padding[0]
          ) {
            so = anchorRect[dirS] + padding[0];
          }
        }
      } else if (
        so + currentSize[mirrorSize] + boundaryOffset[mirrorDirS] >
        viewRect[mirrorSize] + pageOffset
      ) {
        if (!isEnd) {
          so -=
            so +
            currentSize[mirrorSize] -
            viewRect[mirrorSize] -
            pageOffset +
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
      // eslint-disable-next-line prefer-const
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

      let mo = -arrow[mirrorSize] / 2 + (isMainDir ? -offset : offset);

      if (isMainDir) {
        mo += currentSize[size];
        mo = mo - border[dir] - border[MIRROR[dir]];
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
      [AVAILABLE_WIDTH]: availableSizes[WIDTH],
      [AVAILABLE_HEIGHT]: availableSizes[HEIGHT],
      arrow: arrowPosition,
      placement: useFlipM ? MIRROR[placement] : placement,
      transformOrigin,
    };
  }
  return calculate();
}
