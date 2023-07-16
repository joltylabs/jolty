import { EVENT_DESTROY, ID, MODAL } from "../constants";

export default (
  instance,
  {
    remove = false,
    keepInstance = false,
    destroyTransition = true,
    destroyTeleport = true,
  } = {},
) => {
  const {
    base,
    off,
    emit,
    autohide,
    transition,
    floating,
    teleport,
    id,
    uuid,
    instances,
    breakpoints,
  } = instance;

  if (autohide) {
    autohide.destroy();
    instance.autohide = null;
  }
  if (floating) {
    floating.destroy();
    instance.floating = null;
  }
  if (destroyTransition && transition) {
    transition.destroy();
    if (instance.constructor.NAME === MODAL) {
      instance.transitions = null;
    } else {
      instance.transition = null;
    }
  }
  if (destroyTeleport && teleport) {
    teleport.destroy();
    instance.teleport = null;
  }

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
