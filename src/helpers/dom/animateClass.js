export default (elem, className) => {
  elem.classList.remove(className);
  elem.offsetWidth;
  elem.classList.add(className);
  const animations = elem.getAnimations();
  Promise.allSettled(animations.map(({ finished }) => finished)).then(() => {
    elem.classList.remove(className);
  });
};
