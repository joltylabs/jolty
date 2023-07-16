import { isFunction } from "../is";
export default (value, ...data) => (isFunction(value) ? value(...data) : value);
