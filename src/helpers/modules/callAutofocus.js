import { doc, OPTION_PREVENT_SCROLL, SUPPORTS_DIALOG } from "../constants";
export default ({ opts: { autofocus }, getOptionElem, base }, elem = base) => {
  if (elem.contains(doc.activeElement)) return;
  let focusElem = getOptionElem(autofocus.elem, elem);
  const isDialog = elem.tagName === "DIALOG";
  if (
    (!focusElem && autofocus.required && !isDialog) ||
    (isDialog && !SUPPORTS_DIALOG)
  ) {
    focusElem = getOptionElem(autofocus.focusableElements, elem);
  }
  focusElem?.focus({
    [OPTION_PREVENT_SCROLL]: autofocus[OPTION_PREVENT_SCROLL] ?? false,
  });
};
