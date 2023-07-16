export default (time) => {
  if (!time) return;
  let num = parseFloat(time);
  let unit = time.match(/m?s/);
  if (unit) {
    unit = unit[0];
  }
  if (unit === "s") {
    num *= 1000;
  }
  return num;
};
