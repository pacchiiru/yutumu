import svgTemplate from './svg-filters.html';

export class SvgUtils {
  public static injectSvgFilters(): void {
    if (!document.getElementById("svg-filters")) {
      const container = document.createElement("div");
      container.innerHTML = svgTemplate;
      const svgFilters = container.firstElementChild as HTMLElement;
      document.body.appendChild(svgFilters);
    }
  }
}
