import { toggleHideModeState } from "./utils";
export default (Base, NAME) =>
  class extends Base {
    static _data = {};
    static instances = new Map();
    static get NAME() {
      return NAME;
    }
    get isAnimating() {
      return this.transition?.isAnimating;
    }
    get initialPlaceNode() {
      return (
        this.teleport?.placeholder ?? this.transition?.placeholder ?? this.base
      );
    }
    hide(opts) {
      return this.toggle(false, opts);
    }
    show(opts) {
      return this.toggle(true, opts);
    }
    // toggleHideModeState(s) {
    //   toggleHideModeState(s, this);
    // }
    static toggle(id, s, opts) {
      return this.instances.get(id)?.toggle(s, opts);
    }
    static show(id, opts) {
      return this.instances.get(id)?.show(opts);
    }
    static hide(id, opts) {
      return this.instances.get(id)?.hide(opts);
    }
  };
