export default (str, word) =>
  str
    .split(" ")
    .filter((w) => w !== word)
    .join(" ");
