const resizeObserver = new ResizeObserver((entries) => {
  for (const { borderBoxSize, target } of entries) {
    const { blockSize, inlineSize } = borderBoxSize[0];
    target.__resizeCallback__(inlineSize, blockSize);
  }
});
function observeResize(target, fn) {
  target.__resizeCallback__ = fn;
  resizeObserver.observe(target, { box: "border-box" });
}
export { resizeObserver, observeResize };
