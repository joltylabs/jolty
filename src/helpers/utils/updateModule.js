import { DEFAULT } from "../constants";
import { isObject } from "../is";
import { upperFirst } from "./index";
const DEFAULT_PREFIX = upperFirst(DEFAULT);
export default ({ opts, constructor }, name, property = false) => {
  const defaultValue = constructor[DEFAULT_PREFIX + upperFirst(name)];
  const value = opts[name];
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
