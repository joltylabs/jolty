export default (prefix = "") =>
  prefix + Math.random().toString(36).substring(2, 12);
