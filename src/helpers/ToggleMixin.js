export default (Base, NAME) =>
  class extends Base {
    static _data = {};
    static instances = new Map();
    static get NAME() {
      return NAME;
    }
    get isAnimating() {
      return this.transition.isAnimating;
    }
    get isEntering() {
      return this.transition.isEntering;
    }
    get isShown() {
      return this.transition.isShown;
    }
    get initialPlaceNode() {
      return (
        this.teleport?.placeholder ?? this.transition?.placeholder ?? this.base
      );
    }
    async hide(opts) {
      return this.toggle(false, opts);
    }
    async show(opts) {
      return this.toggle(true, opts);
    }
    static async toggle(id, s, opts) {
      return this.instances.get(id)?.toggle(s, opts);
    }
    static async show(id, opts) {
      return this.instances.get(id)?.show(opts);
    }
    static async hide(id, opts) {
      return this.instances.get(id)?.hide(opts);
    }
  };
