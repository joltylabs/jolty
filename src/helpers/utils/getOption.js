import { doc } from "../constants";
import isString from "../is/isString.js";
import returnArray from "./returnArray.js";
import callOrReturn from "./callOrReturn.js";

export default function (multiply, instance, option, root = doc, ...params) {
  if (!option) return;
  option = callOrReturn(option, instance, ...params);
  if (isString(option)) {
    option = root[multiply ? "querySelectorAll" : "querySelector"](option);
  }
  return multiply ? returnArray(option).filter(Boolean) : option;
}
