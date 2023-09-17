import {
  EVENT_DESTROY,
  FLOATING,
  ID,
  PLACEHOLDER,
  TELEPORT,
  TRANSITION,
} from "../constants";

export default (instance, { remove = false, keepInstance = false } = {}) => {
  const { base, off, emit, id, uuid, instances, breakpoints } = instance;

  instance[PLACEHOLDER]?.replaceWith(base);

  ["autohide", FLOATING, TRANSITION, TELEPORT].forEach((key) => {
    if (instance[key]) {
      instance[key].destroy();
      instance[key] = null;
    }
  });

  off();

  if (!keepInstance) {
    base.id.includes(uuid) && base.removeAttribute(ID);
    breakpoints?.destroy();
    instances.delete(id);
  }
  if (remove) {
    base.remove();
  }

  emit(EVENT_DESTROY);

  instance.isInit = false;

  return instance;
};
