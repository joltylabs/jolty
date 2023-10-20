import getBoundingClientRect from "../dom/getBoundingClientRect.js";

export default (elem, { clientX, clientY }) => {
  const rect = getBoundingClientRect(elem);
  return (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  );
};
