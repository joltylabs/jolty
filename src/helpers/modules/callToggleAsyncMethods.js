import { EVENT_HIDDEN, EVENT_SHOWN } from "../constants";

export default async (promise, instance, s, eventParams, silent) => {
  await promise;
  !silent && instance.emit(s ? EVENT_SHOWN : EVENT_HIDDEN, eventParams);
};
