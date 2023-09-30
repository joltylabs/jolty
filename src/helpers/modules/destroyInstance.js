import Base from "../Base.js";
export default (instance) => {
  instance.breakpoints?.destroy();
  instance.instances.delete(instance.id);
  Base.allInstances.delete(instance);
};
