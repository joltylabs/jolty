import { UI_PREFIX } from "../constants/index.js";

export default (prefix = UI_PREFIX) =>
  prefix + Math.random().toString(36).substring(2, 12);
