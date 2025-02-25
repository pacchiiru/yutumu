// Inject SVG filters into the document

import panelSvgFiltersTemplate from './svg-filters.html';

export function injectSvgFilters(): void {
  if (!document.getElementById('svg-filters')) {
    const container = document.createElement('div');
    container.innerHTML = panelSvgFiltersTemplate;
    const svgFilters = container.firstElementChild as HTMLElement;
    document.body.appendChild(svgFilters);
  }
}
