import returnArray from "./returnArray";
export default (source, ...values) =>
  returnArray(source).filter((elem) => !values.includes(elem));
