import { isString } from "./index.js";
export default (value) => value && !!value[Symbol.iterator] && !isString(value);
