# FrostCord local Firefox build

The Firefox manifests have been changed to remove the FrostCord repository homepage and unnecessary raw.githubusercontent.com host access. The Firefox background script no longer handles GitHub stylesheet responses.

The Firefox extension uses locally bundled dist/Equicord.js and dist/Equicord.css, **which are NOT included in this source archive until you build them**. No repository is required to run the extension once compiled and packaged. The build can still need network access to install npm dependencies. Some optional plugins may contact their own remote services.

## Build
1. Install Node.js and pnpm.
2. In the `nightcord` folder run `pnpm install` then `pnpm buildWeb`.
3. Inspect `dist` and the generated browser extension output. Check that `dist/Equicord.js` and `dist/Equicord.css` exist in the extension folder.
4. For temporary Firefox installation use `about:debugging#/runtime/this-firefox` > Load Temporary Add-on, selecting `manifestv2.json` (rename to `manifest.json` in a separate extension staging folder if necessary).
5. Standard Firefox requires signing for permanent installs.

Do not remove license notices or source attribution required by GPL-3.0-or-later. This package is not compiled or browser-tested.
