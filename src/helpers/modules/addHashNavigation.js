import { UI_EVENT_PREFIX } from "../constants/index.js";
import { checkHash } from "../utils/index.js";

export default (instance) => {
  instance.on(window, "hashchange" + UI_EVENT_PREFIX, (event) => {
    if (checkHash(instance.id)) {
      instance.show({ event });
    }
  });
};
