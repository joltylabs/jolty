import {
  ARROW_HEIGHT,
  ARROW_OFFSET,
  ARROW_PADDING,
  ARROW_WIDTH,
  BOUNDARY_OFFSET,
  CLIP_PATH,
  NONE,
  OFFSET,
  PADDING,
  WEBKIT_PREFIX,
} from "../../constants/index.js";

import { getPropertyValue } from "../../dom/index.js";
import createInset from "./createInset.js";
import valuesToArray from "../valuesToArray.js";
import kebabToCamel from "../kebabToCamel.js";

export default (anchorStyles, targetStyles, target, PREFIX) => {
  const CLIP_PATH_PROPERTY = CSS.supports(CLIP_PATH + ":" + NONE)
    ? CLIP_PATH
    : WEBKIT_PREFIX + CLIP_PATH;

  const valuesNames = [
    PADDING,
    OFFSET,
    BOUNDARY_OFFSET,
    ARROW_OFFSET,
    ARROW_PADDING,
    ARROW_WIDTH,
    ARROW_HEIGHT,
  ];
  const values = valuesNames
    .map((name) => {
      let value =
        getPropertyValue(anchorStyles, PREFIX + name) ||
        getPropertyValue(targetStyles, PREFIX + name);
      if (!value) return;

      value = value.replace(/\n/g, "").split(" ").filter(Boolean);

      if (name === BOUNDARY_OFFSET) {
        value = createInset(value, true);
      } else {
        value[1] ??= value[0];
      }
      return { name, value };
    })
    .filter(Boolean);

  const polygonValues = values
    .map(({ name, value }) => {
      if (name === BOUNDARY_OFFSET) {
        const valueEnd = value.splice(2).join(" ");
        value = value.join(" ");
        return [value, valueEnd].join(",");
      }
      return value.join(" ");
    })
    .join(",");

  target.style.setProperty(CLIP_PATH_PROPERTY, `polygon(${polygonValues})`);

  const targetComputedStyle = getComputedStyle(target);

  const computedValues = targetComputedStyle[CLIP_PATH_PROPERTY].slice(8, -1)
    .split(",")
    .values();

  const result = { targetComputedStyle };

  if (values.length) {
    values.forEach(({ name }) => {
      let value = valuesToArray(computedValues.next());
      if (name === BOUNDARY_OFFSET) {
        value = [...value, ...valuesToArray(computedValues.next())];
      } else if (name === OFFSET || name === ARROW_OFFSET) {
        value = value[0];
      }
      result[kebabToCamel(name)] = value;
    });
  }

  if (values.length) {
    target.style.removeProperty(CLIP_PATH_PROPERTY);
  }

  return result;
};
