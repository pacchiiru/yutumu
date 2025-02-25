// Utility functions for DOM manipulation

export function getElementOffsetWidth(selector: string): number {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) throw new Error(`Element not found for selector: ${selector}`);
    return el.offsetWidth;
}

export function getElementOffsetHeight(selector: string): number {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) throw new Error(`Element not found for selector: ${selector}`);
    return el.offsetHeight;
}

export function getScrollbarWidth(): number {
    return window.innerWidth - document.documentElement.clientWidth;
}

export function getAttributeValue(item: Element, attribute: string): string {
    return item.getAttribute(attribute) || "";
}