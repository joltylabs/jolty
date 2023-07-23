import { returnArray, callOrReturn } from "./index.js";
import { isString } from "../is";
import { doc } from "../constants";

export default function (multiply, instance, option, root = doc, ...params) {
  if (!option) return;
  option = callOrReturn(option, instance, ...params);
  if (isString(option)) {
    option = root[multiply ? "querySelectorAll" : "querySelector"](option);
  }
  return multiply ? returnArray(option).filter(Boolean) : option;
}
