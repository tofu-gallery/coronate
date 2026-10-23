# Coronate on Tofu

Coronate is a free manager for Swiss-system chess tournaments, written by John Jackson in ReScript and React. A tournament
director registers players, creates a tournament, lets the app pair each round (or pairs players by hand), enters results,
and reads the standings, crosstable and score details. It needs no account: everything is saved in the visitor's own
browser (IndexedDB, through localForage), and the Options page exports and imports that data as a JSON file.

## How Tofu runs it

| | |
|---|---|
| Framework preset | `vite` |
| Package manager | pnpm 11, from the `packageManager` field, with upstream's own `pnpm-lock.yaml` |
| Install | `pnpm install --frozen-lockfile` |
| Build | `pnpm run build` (`vite build`; the ReScript sources compile inside it through `@jihchi/vite-plugin-rescript`) |
| Output directory | `dist` |
| Node.js | upstream develops on 26 (`.nvmrc`); the build was verified on 22.22.3 |
| Environment variables | none |
| Database | none: each visitor's data stays in their own browser |
| Routes | client-side paths such as `/tourneys` and `/options`; `vercel.json` serves `index.html` for them |

Once loaded, the app makes no network requests of its own: fonts, icons and images are bundled into `dist`.

## What we changed, and why

All changes are on the `tofu` branch; `master` mirrors upstream untouched.

1. **The build works without a Git checkout.** Upstream's `vite.config.mjs` ran `git log` to put the last commit date in
   the About dialog, so a build from an uploaded folder or a source archive failed. It now reads the pinned upstream
   commit's date from `tofu-upstream.json`.
2. **The GitHub gist backup is hidden.** The Options page's *Backup to GitHub* panel signs in through the upstream author's
   Netlify site and GitHub OAuth app, which a copy hosted anywhere else cannot use. The panel is switched off at build time
   (`__GITHUB_BACKUP_ENABLED__` in `vite.config.mjs`); its code is still in the bundle but can no longer be reached, and it
   makes no requests. Backing up locally (export to a file, load from a file, edit the JSON) is unchanged.
3. **The footer links to this version's source.** The home page keeps upstream's links and adds one to this adapted
   source, as MPL-2.0 section 3.2(a) asks of a modified Executable Form.
4. **`vercel.json`** serves `index.html` for every path that is not a file, as upstream's `netlify.toml` does on Netlify,
   and names the Vite build and its `dist` output.
5. **This file.**

The upstream files we modified (`vite.config.mjs`, `src/PageOptions.res`, `src/Pages.res`) say so in a comment near the
top. The name, logo, favicon and the author's own links, including *Buy Me A Coffee*, are unchanged.

## Upstream

- Repository: https://github.com/johnridesabike/coronate
- Based on: `master` at `b5ada61031d768b1dc858ec699b502407a76cae6` (2026-08-31)
- This adapted version: tag `pin/2026-10-23` in https://github.com/tofu-gallery/coronate

When this branch moves to a newer upstream commit, update `tofu-upstream.json` and the tag in the footer link in
`src/Pages.res`.

## Licence

Mozilla Public License 2.0 (`LICENSE`, unchanged from upstream). Copyright John Jackson. The changes listed above are
offered under the same licence.
