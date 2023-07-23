import { returnArray, callOrReturn } from "./index.js";
import { isString, isHTML } from "../is";
import { fragment } from "../dom";
import { doc } from "../constants";

export default function (multiply, instance, option, root = doc, ...params) {
  if (!option) return;
  option = callOrReturn(option, instance, ...params);
  if (isString(option)) {
    if (isHTML(option)) {
      option = fragment(option);
    } else {
      option = root[multiply ? "querySelectorAll" : "querySelector"](option);
    }
  }

  return multiply ? returnArray(option).filter(Boolean) : option;
}
