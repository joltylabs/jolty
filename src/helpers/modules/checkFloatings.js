import { arrayFrom } from "../utils/index.js";

const FLOATING_IS_INTERACTED = ":hover,:focus-within";
export default function (instance, s) {
  const floating = instance.floating;

  if (!floating) return;
  let parentFloating = floating.parentFloating;

  if (s) {
    while (parentFloating) {
      parentFloating.instance.show();
      parentFloating = parentFloating.parentFloating;
    }
  } else {
    if (
      parentFloating &&
      !parentFloating.base.matches(FLOATING_IS_INTERACTED)
    ) {
      parentFloating.instance.hide();
    }

    let floatings = arrayFrom(floating.floatings);
    while (floatings.length) {
      for (const childFloating of floatings) {
        if (childFloating.base.matches(FLOATING_IS_INTERACTED)) {
          instance.isOpen = true;
          return true;
        }
        floatings = arrayFrom(childFloating.floatings);
      }
    }
  }
}
