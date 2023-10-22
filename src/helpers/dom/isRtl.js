const supportsDir = CSS.supports("selector(:dir(rtl))");
export default (elem) =>
  supportsDir
    ? elem.matches(":dir(rtl)")
    : elem.closest("[dir]")?.dir === "rtl";
