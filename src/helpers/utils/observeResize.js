let resizeObserver;

const getResizeObserver = () => {
  if (resizeObserver) return resizeObserver;
  resizeObserver = new ResizeObserver((entries) => {
    for (const { borderBoxSize, target } of entries) {
      const { blockSize, inlineSize } = borderBoxSize[0];
      target.__resizeCallback__(inlineSize, blockSize);
    }
  });
  return resizeObserver;
};

function observeResize(target, fn) {
  target.__resizeCallback__ = fn;
  getResizeObserver().observe(target, { box: "border-box" });
}
export { getResizeObserver, observeResize };
