function collectFloatings(child) {
  const result = [];
  if (child?.floatings) {
    result.push(...child.floatings);
    for (const floating of child.floatings) {
      result.push(...collectFloatings(floating));
    }
  }
  return result;
}

export default function (instance, s) {
  if (s && instance?.floating?.parentFloating?.instance?.isOpen === false)
    return true;

  if (!s && instance.floating) {
    const parentFloating = instance.floating.parentFloating;

    if (
      parentFloating &&
      !parentFloating.base.matches(":hover,:focus-within")
    ) {
      parentFloating.hide();
    }

    const allChildFloatings = collectFloatings(instance.floating);

    if (
      allChildFloatings.some((childFloating) =>
        childFloating?.base?.matches(":hover,:focus-within"),
      )
    ) {
      instance.isOpen = true;
      return true;
    }
  }
}
