import { UI_PREFIX, ACTIVE } from "../constants";
export default (name) => UI_PREFIX + (name ? name + "-" : "") + ACTIVE;
