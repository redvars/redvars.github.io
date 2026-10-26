// redvars.com used to serve a copy of the Peacock docs. Each of those pages now sends
// visitors to the same path on peacock.redvars.com. GitHub Pages has no server redirects,
// so Astro writes a page per path that redirects in the browser.

const components = [
    'accordion', 'alert', 'app-bar', 'avatar', 'badge', 'bottom-sheet', 'breadcrumb', 'button',
    'button-group', 'calendar', 'canvas', 'card', 'chart-bar', 'chart-doughnut', 'chart-pie',
    'checkbox', 'chip', 'circular-progress', 'clock', 'code-editor', 'code-highlighter',
    'color-picker', 'condition-builder', 'date-picker', 'divider', 'dropdown', 'dropdown-button',
    'elevation', 'empty-state', 'fab', 'field', 'flow-designer', 'focus-ring', 'footer', 'header',
    'html-editor', 'icon', 'icon-button', 'image', 'input', 'input-url', 'item', 'linear-progress',
    'link', 'list', 'menu', 'modal', 'navigation-rail', 'notification', 'notification-manager',
    'number-counter', 'number-field', 'pagination', 'popover', 'popover-content',
    'progress-indicator', 'ripple', 'search', 'segmented-button-group', 'select', 'side-sheet',
    'sidebar-menu', 'sidenav', 'skeleton', 'slider', 'snackbar', 'spinner', 'split-button', 'svg',
    'switch', 'table', 'tabs', 'tag', 'text', 'textarea', 'time-picker', 'toolbar', 'tooltip',
    'tree-view', 'url-field',
];

const paths = [
    'components',
    ...components.map((name) => `components/${name}`),
    'blocks',
    'blocks/dashboard',
    'blocks/login',
    'blog',
    'blog/posts/2023-08-03-whats-up-nerds',
    'blog/posts/2023-08-04-first-release',
    'color',
    'theme-creator',
    'layout/default',
    'layout/with-sidebar',
    'license',
];

export const peacockRedirects = Object.fromEntries(
    paths.map((path) => [`/${path}`, `https://peacock.redvars.com/${path}/`]),
);
