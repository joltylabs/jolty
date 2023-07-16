import { isArray, isObject } from "../is";
export default function mergeDeep(...objects) {
  const result = {};
  for (const object of objects.filter(Boolean)) {
    for (const [key, value] of Object.entries(object)) {
      if (isObject(result[key])) {
        result[key] = isObject(value) ? mergeDeep(result[key], value) : value;
      } else if (isArray(result[key])) {
        result[key] = isArray(value) ? [...result[key], ...value] : value;
      } else if (value !== undefined) {
        result[key] = value;
      }
    }
  }
  return result;
}
