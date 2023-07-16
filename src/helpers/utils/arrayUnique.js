import arrayFrom from "./arrayFrom";
export default (array) =>
  array.length > 1 ? arrayFrom(new Set(array)) : array;
