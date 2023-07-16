import { isString } from "../is";
import { arrayFrom } from "../utils";
export default (html, findSelectors) => {
  let children = html;
  if (isString(html)) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    if (findSelectors) {
      return arrayFrom(doc.querySelectorAll(findSelectors));
    }
    children = doc.body.children;
  }
  return children
    ? children.length > 1
      ? arrayFrom(children)
      : children[0]
    : "";
};
