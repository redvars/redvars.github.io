# redvars.com

The Redvars website: an [Astro](https://astro.build) static site built with [Peacock](https://peacock.redvars.com) components and design tokens. What it holds and where it is going are in [SITES.md](https://github.com/redvars/engineering/blob/main/SITES.md).

## Develop

Needs Node 22.12 or later.

```
npm install
npm run dev
```

The dev server runs at http://localhost:4000. `npm run build` type-checks the site and writes it to `dist/`; `npm run preview` serves that build.

| Path | What it is |
|:--|:--|
| `src/site.ts` | Name, tagline, motto, contact address and the Peacock version |
| `src/layouts/Base.astro` | The page shell: head, Peacock, fonts, header and footer |
| `src/pages/` | One file per page |
| `src/styles/global.css` | Page-wide styles; maps Peacock's primary colour to Redvars red |
| `public/` | Files copied as they are, such as the logo and `robots.txt` |
| `src/components/GoogleAnalytics.astro` | The Google tag, loaded only in production builds |
| `peacock-redirects.mjs` | The old Peacock paths, sent on to peacock.redvars.com |

Peacock loads from its npm release on jsDelivr. To move to a new release, change `peacockVersion` in `src/site.ts`.

## Deploy

[`.github/workflows/astro.yml`](.github/workflows/astro.yml) builds every pull request and deploys `main` to GitHub Pages. In the repository's Pages settings the source is **GitHub Actions** and the custom domain is `redvars.com`. ADR-0006 moves the site to Cloudflare Pages with a preview per pull request (CORE-93); only the deploy step changes.
