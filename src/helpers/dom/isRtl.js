import { isCSSDirSupported } from "../utils/index.js";

export default (elem) =>
  isCSSDirSupported()
    ? elem.matches(":dir(rtl)")
    : elem.closest("[dir]")?.dir === "rtl";
