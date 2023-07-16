import { DATA_UI_PREFIX, ACTION_TOGGLE } from "../constants";
export default (id, multiply) =>
  `[${DATA_UI_PREFIX + ACTION_TOGGLE}${
    multiply ? "~" : ""
  }="${id}"],[href="#${id}"]`;
