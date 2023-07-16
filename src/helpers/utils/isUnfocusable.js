import { SELECTOR_DISABLED, SELECTOR_INERT } from "../constants";
const UNFOCUSABLE_SELECTORS = `${SELECTOR_DISABLED},${SELECTOR_INERT}`;
export default (elem) => elem.matches(UNFOCUSABLE_SELECTORS);
