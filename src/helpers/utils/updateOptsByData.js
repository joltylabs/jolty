import { UI, OPTIONS_BOOLEAN } from "../constants";
import { isArray } from "../is";
import { upperFirst } from "../utils";

export default (opts, dataset, names) => {
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
        value = hasAttribute;
      } else if (value && value[0] === "{") {
        value = JSON.parse(value);
      }
      opts[optionName] = value;
    }
  });
  return opts;
};
