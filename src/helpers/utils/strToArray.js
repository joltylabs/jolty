import { isArray } from "../is";
export default (str = "", separator = " ") =>
  str ? (isArray(str) ? str : str.split(separator)).filter(Boolean) : [];
