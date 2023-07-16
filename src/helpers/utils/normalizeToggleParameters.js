import { isObject } from "../is";
export default (animated = true) =>
  isObject(animated) ? { animated: true, ...animated } : { animated };
