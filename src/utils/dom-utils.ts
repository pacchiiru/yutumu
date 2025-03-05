export class DomUtils {
  public static getAttributeValue(item: Element | null, attribute: string): string {
    return item?.getAttribute(attribute) || "";
  }

  public static getTextContent(item: Element | null): string {
    return item?.textContent || "";
  }

  public static getElementOffsetHeight(selector: string): number {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) {
      throw new Error(`Element not found for selector: ${selector}`);
    }
    return el.offsetHeight;
  }

  public static getElementOffsetWidth(selector: string): number {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) {
      throw new Error(`Element not found for selector: ${selector}`);
    }
    return el.offsetWidth;
  }

  public static getScrollbarWidth(): number {
    return window.innerWidth - document.documentElement.clientWidth;
  }
}
