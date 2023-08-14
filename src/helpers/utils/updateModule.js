import { DEFAULT } from "../constants";
import { isObject, isString } from "../is";
import { upperFirst } from "./index";
const DEFAULT_PREFIX = upperFirst(DEFAULT);
export default ({ opts, constructor }, name, property = false, defaults) => {
  const defaultValue = constructor[DEFAULT_PREFIX + upperFirst(name)];
  let value = opts[name];
  if (defaults && value && isString(value)) {
    value = defaults[value];
  }
  if (isObject(value)) {
    opts[name] = { ...defaultValue, ...value };
  } else if (value) {
    opts[name] = { ...defaultValue };
    if (property) {
      opts[name][property] = value;
    }
  }
  return opts;
};
