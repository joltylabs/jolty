const cache = {};
export default (str = "") =>
  cache[str] ||
  (cache[str] = str.replace(/-./g, (match) => match[1].toUpperCase()));
