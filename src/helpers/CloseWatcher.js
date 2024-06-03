import { EVENT_CLOSE, EVENT_KEYDOWN, KEY_ESC } from "./constants/index.js";

const stack = [];

let isDocumentListenerAdded = false;
const CloseWatcherDocPolyfill = () => {
  if (isDocumentListenerAdded) return;
  document.addEventListener(EVENT_KEYDOWN, (event) => {
    if (!event.isTrusted || event.keyCode !== KEY_ESC) return;

    const closeWatcher = stack.at(-1);

    if (!closeWatcher) return;

    setTimeout(() => {
      if (event.defaultPrevented) return;
      closeWatcher.close();
    }, 0);
  });
  isDocumentListenerAdded = true;
};

let CloseWatcher;

const getCloseWatcher = () => {
  if (CloseWatcher) return CloseWatcher;

  const CloseWatcherClass =
    window.CloseWatcher ||
    class CloseWatcher extends EventTarget {
      isActive = true;
      oncloseHandler = null;
      constructor() {
        super();
        stack.push(this);
      }

      destroy() {
        this.deactivate();
      }

      close() {
        if (!this.isActive || !document.defaultView) return;

        this.dispatchEvent(new Event(EVENT_CLOSE));
        this.deactivate();
      }

      deactivate() {
        this.isActive = false;
        const index = stack.indexOf(this);
        if (index !== -1) {
          stack.splice(index, 1);
        }
      }

      set onclose(handler) {
        if (this.oncloseHandler && handler === null) {
          this.removeEventListener(EVENT_CLOSE, this.oncloseHandler);
          this.oncloseHandler = null;
        } else {
          this.oncloseHandler = handler;
          this.addEventListener(EVENT_CLOSE, this.oncloseHandler);
        }
      }
    };

  if (!window.CloseWatcher) {
    CloseWatcherDocPolyfill();
  }

  CloseWatcher = CloseWatcherClass;

  return CloseWatcher;
};

export default getCloseWatcher;
