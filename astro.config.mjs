import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { peacockRedirects } from './peacock-redirects.mjs';

// The waitlist is a Microsoft Form. The site links to redvars.com/waitlist, which redirects
// here, so shared links survive when sign-up replaces it.
const waitlistFormUrl = 'https://forms.cloud.microsoft/r/w27zVpnfdR';

// https://astro.build/config
export default defineConfig({
    site: 'https://redvars.com',
    devToolbar: { enabled: false },
    server: { port: 4000, host: true },
    redirects: {
        '/waitlist': waitlistFormUrl,
        ...peacockRedirects,
    },
    integrations: [sitemap()],
});
