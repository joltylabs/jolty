const cache = {};
export default (str = "") =>
  cache[str] || (cache[str] = str[0].toUpperCase() + str.slice(1));
