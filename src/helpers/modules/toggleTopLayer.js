import { isDialog } from "../is/index.js";
import {
  MODAL,
  POPOVER,
  POPOVER_API_MODE_MANUAL,
  POPOVER_API_SUPPORTED,
} from "../constants/index.js";

export const destroyTopLayer = (elem) => {
  elem.popover && elem.hidePopover?.();
  elem.close?.();
  elem.popover = null;
};

export const addPopoverAttribute = (instance, elem = instance.base) => {
  elem.popover =
    instance.opts.topLayer &&
    (!instance.opts[MODAL] || !isDialog(elem)) &&
    POPOVER_API_SUPPORTED
      ? POPOVER_API_MODE_MANUAL
      : null;
};

export const toggleTopLayer = (instance, s) => {
  const { constructor, opts } = instance;
  const target = instance[constructor.NAME];
  const targetIsDialog = isDialog(target);
  const targetIsModal = targetIsDialog && opts[MODAL];
  const targetIsPopover =
    opts.topLayer && POPOVER_API_SUPPORTED && target.popover;

  if (s) {
    if (targetIsDialog) {
      if (targetIsModal) {
        if (target.open) target.close();
        target.showModal();
        constructor.dispatchTopLayer(MODAL);
      } else {
        if (targetIsPopover) {
          target.close?.();
          target.showPopover();
          constructor.dispatchTopLayer(POPOVER);
        } else {
          target.show();
        }
      }
    } else if (targetIsPopover) {
      target.showPopover();
      constructor.dispatchTopLayer(POPOVER);
    }
  } else {
    target.close?.();
    target[POPOVER] && target.hidePopover?.();
  }
};
