import {
  UI,
  APPEAR,
  OPTION_TOP_LAYER,
  OPTION_PREVENT_SCROLL,
  MODAL,
  TRUE,
  FALSE,
  OPTION_HASH_NAVIGATION,
  OPTION_AUTODESTROY,
} from "../constants";
import { isArray } from "../is";
import { upperFirst } from "../utils";
export const OPTIONS_BOOLEAN = [
  APPEAR,
  OPTION_TOP_LAYER,
  OPTION_PREVENT_SCROLL,
  OPTION_HASH_NAVIGATION,
  MODAL,
  OPTION_AUTODESTROY,
];
export default (opts, { dataset }, names) => {
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
      if (OPTIONS_BOOLEAN.includes(optionName)) {
        value =
          value === "" || value === TRUE
            ? true
            : value === FALSE
            ? false
            : undefined;
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
