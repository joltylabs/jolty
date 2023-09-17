import { isArray, isObject, isNumber } from "../../is/index.js";
export default (input, returnArray) => {
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
      top = input[0];
      right = left = input[1];
      bottom = input[2];
    } else {
      top = input[0];
      right = input[1];
      bottom = input[2];
      left = input[3];
    }
  } else if (isObject(input)) {
    top = input.top || 0;
    right = input.right || 0;
    bottom = input.bottom || 0;
    left = input.left || 0;
  }
  if (returnArray) {
    return [top, right, bottom, left];
  } else {
    return { top, right, bottom, left };
  }
};
