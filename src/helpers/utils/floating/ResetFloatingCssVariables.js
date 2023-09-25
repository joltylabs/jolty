import {
  ARROW_HEIGHT,
  ARROW_OFFSET,
  ARROW_PADDING,
  ARROW_WIDTH,
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
import createElement from "../createElement.js";

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
      ARROW_WIDTH,
      ARROW_HEIGHT,
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
