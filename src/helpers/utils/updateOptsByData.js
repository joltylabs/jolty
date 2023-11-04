import { UI, TRUE, FALSE, OPTION_PREVENT_SCROLL, AUTO } from "../constants";
import upperFirst from "./upperFirst.js";
import isArray from "../is/isArray.js";

export default (opts, { dataset }, names, booleanOptions) => {
  names.forEach((name) => {
    let optionName = name;
    let attributeName = name;
    if (isArray(name)) {
      optionName = name[0];
      attributeName = name[1];
    }
    let value = dataset[UI + upperFirst(attributeName)];
    const hasAttribute = value !== undefined;
    if (hasAttribute) {
      if (booleanOptions?.includes(optionName)) {
        const isTrue = value === "" || value === TRUE;
        const isFalse = value === FALSE;
        const isAuto = value === AUTO && optionName === OPTION_PREVENT_SCROLL;
        value = isTrue ? true : isFalse ? false : isAuto ? AUTO : undefined;
      } else if (value && value[0] === "{") {
        value = JSON.parse(value);
      }

      if (value !== undefined) {
        opts[optionName] = value;
      }
    }
  });
  return opts;
};
