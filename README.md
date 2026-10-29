# redvars.com

The Redvars website: an [Astro](https://astro.build) static site built with [Peacock](https://peacock.redvars.com) components and design tokens.

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
| `public/` | Files copied as they are, such as the logo, `og-image.png` (the 1200×630 link preview) and `robots.txt` |
| `public/install.sh`, `install.ps1`, `install.cmd` | The CLI's installers (below) |
| `src/components/GoogleAnalytics.astro` | The Google tag, loaded only in production builds |
| `peacock-redirects.mjs` | The old Peacock paths, sent on to peacock.redvars.com |

Peacock loads from its npm release on jsDelivr. To move to a new release, change `peacockVersion` in `src/site.ts`.

## The CLI's installers

The `redvars` CLI installs with one line:

| Where | Command |
|:--|:--|
| macOS, Linux, WSL | `curl -fsSL https://redvars.com/install.sh \| bash` |
| Windows PowerShell | `irm https://redvars.com/install.ps1 \| iex` |
| Windows CMD | `curl -fsSL https://redvars.com/install.cmd -o install.cmd && install.cmd && del install.cmd` |

Each takes `stable` (the default), `preview` or a version: `bash -s preview`, `& ([scriptblock]::Create((irm https://redvars.com/install.ps1))) preview`, `install.cmd preview`. They change only when how the CLI installs changes, not with each CLI version: they read the version and each executable's SHA-256 from the store (`https://store.redvars.com/v1/cli/<stable|preview|version>.txt`, which the store's publish workflow writes), download the executable from the store's GitHub release, check the digest, and put it in `~/.local/bin` (`/usr/local/bin` as root) or `%USERPROFILE%\.local\bin` (`%ProgramFiles%\redvars` elevated, added to the Path). `PLATFORM_STORE_URL` and `PLATFORM_RELEASES_URL` point them at a mirror or a test store.

`install.cmd` runs `install.ps1` in Windows PowerShell. `.gitattributes` keeps `install.sh` in LF and `install.cmd` in CRLF.

## Deploy

[`.github/workflows/astro.yml`](.github/workflows/astro.yml) builds every pull request and deploys `main` to GitHub Pages. In the repository's Pages settings the source is **GitHub Actions** and the custom domain is `redvars.com`.
