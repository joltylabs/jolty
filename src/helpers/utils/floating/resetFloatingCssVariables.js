import {
  BOUNDARY_OFFSET,
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

export default () => {
  const registerProperty = CSS.registerProperty;
  let css = "";
  [TOOLTIP, DROPDOWN, POPOVER].forEach((name) => {
    const PREFIX = VAR_UI_PREFIX + name + "-";
    [STICKY, FLIP, SHRINK, PLACEMENT, PADDING, OFFSET, BOUNDARY_OFFSET].forEach(
      (prop) => {
        if (registerProperty) {
          registerProperty({
            name: PREFIX + prop,
            syntax: "*",
            inherits: false,
          });
        } else {
          css += PREFIX + prop + ":;";
        }
      },
    );
  });

  if (!registerProperty) {
    document.head.appendChild(createElement(STYLE, false, `*{${css}}`));
  }
};
