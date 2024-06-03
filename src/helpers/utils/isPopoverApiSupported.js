import { POPOVER } from "../constants/index.js";

let isSupported;
export default () =>
  isSupported === undefined
    ? (isSupported = HTMLElement.prototype.hasOwnProperty(POPOVER))
    : isSupported;
