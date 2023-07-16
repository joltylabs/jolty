import arrayFrom from "./arrayFrom";
import { isIterable } from "../is";
export default (elem) =>
  elem !== undefined ? (isIterable(elem) ? arrayFrom(elem) : [elem]) : [];
