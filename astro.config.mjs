import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { peacockRedirects } from './peacock-redirects.mjs';

// https://astro.build/config
export default defineConfig({
    site: 'https://redvars.com',
    devToolbar: { enabled: false },
    server: { port: 4000, host: true },
    redirects: peacockRedirects,
    integrations: [sitemap()],
});
