import getElements from "./getElements.js";

export default (selector, context, findSelf) =>
  getElements(selector, context, findSelf)[0];
