/** Selectores de contenido Radix renderizado en portal (fuera del DOM del Dialog). */
const RADIX_PORTAL_OVERLAY_SELECTORS = [
  "[data-slot='select-content']",
  "[data-slot='select-trigger']",
  "[data-slot='popover-content']",
  "[data-slot='dropdown-menu-content']",
  "[data-slot='dropdown-menu-sub-content']",
  "[data-slot='context-menu-content']",
  "[data-slot='menubar-content']",
  "[data-radix-select-content]",
  "[data-radix-popper-content-wrapper]",
  "[data-radix-select-viewport]",
] as const;

const OPEN_OVERLAY_SELECTORS = [
  "[data-slot='select-content'][data-state='open']",
  "[data-slot='popover-content'][data-state='open']",
  "[data-slot='dropdown-menu-content'][data-state='open']",
] as const;

/**
 * Detecta clics en overlays portaleados (Select, Popover, etc.) que viven fuera del
 * árbol del Dialog pero no deben cerrarlo.
 */
export function isRadixPortaledOverlayTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return RADIX_PORTAL_OVERLAY_SELECTORS.some((selector) =>
    Boolean(target.closest(selector)),
  );
}

export function hasOpenRadixOverlay(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return OPEN_OVERLAY_SELECTORS.some((selector) =>
    Boolean(document.querySelector(selector)),
  );
}

export function getDismissEventTarget(
  event: CustomEvent<{ originalEvent: PointerEvent | FocusEvent }>,
): EventTarget | null {
  return event.detail?.originalEvent?.target ?? event.target ?? null;
}

export function isDialogOverlayTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(target.closest("[data-slot='dialog-overlay']"));
}

export function shouldPreventDialogDismiss(
  event: CustomEvent<{ originalEvent: PointerEvent | FocusEvent }>,
): boolean {
  const target = getDismissEventTarget(event);

  if (isDialogOverlayTarget(target)) {
    return false;
  }

  if (hasOpenRadixOverlay()) {
    return true;
  }

  return isRadixPortaledOverlayTarget(target);
}
