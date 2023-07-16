import { DATA_UI_PREFIX } from "../constants";
export default (...values) => `[${DATA_UI_PREFIX + values.join("-")}]`;
