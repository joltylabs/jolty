const cache = {};
export default (str = "") =>
  cache[str] ||
  (cache[str] = str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase());
