import isString from "./isString.js";

export default (value) => value && !!value[Symbol.iterator] && !isString(value);
