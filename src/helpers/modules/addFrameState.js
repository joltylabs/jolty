export default (instance, s) => {
  if (s) {
    instance._isOpening = true;
    requestAnimationFrame(() => (instance._isOpening = false));
  } else {
    instance._isClosing = true;
    requestAnimationFrame(() => (instance._isClosing = false));
  }
};
