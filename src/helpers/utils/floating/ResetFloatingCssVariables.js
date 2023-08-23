import {
  ARROW_OFFSET,
  ARROW_PADDING,
  BOUNDARY_OFFSET,
  doc,
  DROPDOWN,
  FLIP,
  OFFSET,
  PADDING,
  PLACEMENT,
  POPOVER,
  SHRINK,
  STICKY,
  STYLE,
  TOOLTIP,
  VAR_UI_PREFIX,
} from "../../constants/index.js";
import { createElement } from "../index.js";

const registerProperty = CSS.registerProperty;

export default () => {
  let css = "";
  [TOOLTIP, DROPDOWN, POPOVER].forEach((name) => {
    const PREFIX = VAR_UI_PREFIX + name + "-";
    [
      STICKY,
      FLIP,
      SHRINK,
      PLACEMENT,
      PADDING,
      OFFSET,
      BOUNDARY_OFFSET,
      ARROW_OFFSET,
      ARROW_PADDING,
    ].forEach((prop) => {
      if (registerProperty) {
        registerProperty({
          name: PREFIX + prop,
          syntax: "*",
          inherits: false,
        });
      } else {
        css += PREFIX + prop + ":;";
      }
    });
  });

  if (!registerProperty) {
    doc.head.appendChild(createElement(STYLE, false, `*{${css}}`));
  }
};
