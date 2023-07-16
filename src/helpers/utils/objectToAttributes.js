export default (obj) =>
  Object.entries(obj)
    .map(([name, value]) => `${name}="${value}"`)
    .join(" ");
