export default (elem) => {
  const { overflow, overflowX, overflowY, display } = getComputedStyle(elem);
  return (
    !/inline|contents/.test(display) &&
    /auto|hidden|scroll|overlay|clip/.test(overflow + overflowY + overflowX)
  );
};
