import { DATA_UI_PREFIX } from "../constants/index.js";

export default (elem, name, property) => {
  let datasetValue = elem.getAttribute(DATA_UI_PREFIX + name)?.trim() || "";
  const isDataObject = datasetValue[0] === "{";
  if (datasetValue) {
    if (isDataObject) {
      datasetValue = JSON.parse(datasetValue);
    } else if (property) {
      datasetValue = { [property]: datasetValue };
    }
  }
  return property ? datasetValue : [datasetValue, isDataObject];
};
