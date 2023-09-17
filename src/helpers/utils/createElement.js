import { isString } from "../is";
import { addClass, addStyle, setAttribute } from "../dom";
import { CLASS, STYLE, DIV, doc } from "../constants";
import camelToKebab from "./camelToKebab";
export default (type = DIV, props, ...content) => {
  const elem = doc.createElement(type);
  if (props) {
    if (isString(props)) {
      props = { class: props };
    }
    Object.entries(props).forEach(([name, value]) => {
      if (name === CLASS) {
        addClass(elem, value);
      } else if (name === STYLE) {
        if (isString(value)) {
          elem.style = value;
        } else {
          addStyle(elem, value);
        }
      } else {
        setAttribute(elem, camelToKebab(name), value);
      }
    });
  }
  content.forEach((item) => item && elem.append(item));
  return elem;
};
