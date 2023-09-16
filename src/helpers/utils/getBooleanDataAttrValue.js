import { DATA_UI_PREFIX, FALSE } from "../constants/index.js";

export default (elem, name) => {
  const value = elem.getAttribute(DATA_UI_PREFIX + name);
  return value === null ? value : value !== FALSE;
};
