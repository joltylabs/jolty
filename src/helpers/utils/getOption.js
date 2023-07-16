import { returnArray, callOrReturn } from "./index.js";
import { isString, isHTML } from "../is";
import { fragment } from "../dom";
import { doc } from "../constants";

export default function (multiply, option, root = doc, ...params) {
  if (!option) return;
  option = callOrReturn(option, this, ...params);
  if (isString(option)) {
    if (isHTML(option)) {
      option = fragment(option);
    } else {
      if (option[0] === "#") {
        root = doc;
      }
      option =
        doc.getElementById(option) ||
        root[multiply ? "querySelectorAll" : "querySelector"](option);
    }
  }
  return multiply ? returnArray(option) : option;
}
