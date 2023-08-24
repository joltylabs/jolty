import {
  ARROW_OFFSET,
  ARROW_PADDING,
  BOUNDARY_OFFSET,
  CLIP_PATH_PROPERTY,
  FLIP,
  OFFSET,
  PADDING,
  PLACEMENT,
  SHRINK,
  STICKY,
} from "../../constants/index.js";
import { createInset, kebabToCamel, valuesToArray } from "../index.js";
import { getPropertyValue } from "../../dom/index.js";

export default (anchorStyles, targetStyles, wrapper, PREFIX) => {
  const valuesNames = [
    PADDING,
    OFFSET,
    BOUNDARY_OFFSET,
    ARROW_OFFSET,
    ARROW_PADDING,
  ];
  const values = valuesNames
    .map((name) => {
      let value =
        getPropertyValue(anchorStyles, PREFIX + name) ||
        getPropertyValue(targetStyles, PREFIX + name);
      if (!value) return;
      value = value.split(" ");
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

  wrapper.style.setProperty(CLIP_PATH_PROPERTY, `polygon(${polygonValues})`);

  const wrapperComputedStyle = getComputedStyle(wrapper);

  const computedValues = wrapperComputedStyle[CLIP_PATH_PROPERTY].slice(8, -1)
    .split(",")
    .values();

  const result = { wrapperComputedStyle };

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
    wrapper.style.removeProperty(CLIP_PATH_PROPERTY);
  }

  return result;
};
