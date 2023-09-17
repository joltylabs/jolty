import {
  OPTION_HASH_NAVIGATION,
  PRIVATE_PREFIX,
  UI_EVENT_PREFIX,
} from "../constants/index.js";
import { checkHash } from "../utils/index.js";

const EVENT_HASHCHANGE = "hashchange" + UI_EVENT_PREFIX;
export default (instance) => {
  if (instance.opts[OPTION_HASH_NAVIGATION]) {
    instance[PRIVATE_PREFIX + OPTION_HASH_NAVIGATION] = true;
    instance.on(window, EVENT_HASHCHANGE, (event) => {
      if (checkHash(instance.id)) {
        instance.show({ event });
      }
    });
  } else if (instance[PRIVATE_PREFIX + OPTION_HASH_NAVIGATION]) {
    instance.off(window, EVENT_HASHCHANGE);
    instance[PRIVATE_PREFIX + OPTION_HASH_NAVIGATION] = false;
  }
};
