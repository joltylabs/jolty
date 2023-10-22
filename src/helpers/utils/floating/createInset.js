import { isArray, isObject, isNumber } from "../../is/index.js";
export default (input, returnArray, isRtl) => {
  let top = 0,
    right = 0,
    bottom = 0,
    left = 0;
  if (isNumber(input)) {
    top = right = bottom = left = input;
  } else if (isArray(input)) {
    if (input.length === 1) {
      top = right = bottom = left = input[0];
    } else if (input.length === 2) {
      top = bottom = input[0];
      right = left = input[1];
    } else if (input.length === 3) {
      [top, right, bottom] = input;
      left = right;
    } else {
      [top, right, bottom, left] = input;
    }
  } else if (isObject(input)) {
    ({ top = 0, right = 0, bottom = 0, left = 0 } = input);
  }

  if (isRtl) {
    [right, left] = [left, right];
  }

  return returnArray
    ? [top, right, bottom, left]
    : { top, right, bottom, left };
};
