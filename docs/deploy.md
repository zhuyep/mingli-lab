# Deployment

`npm ci && npm test && npm run build` produces `dist/`. Serve that directory with any static server. `npm run preview` is a local verification server. Relative assets support GitHub project subpaths; no server-side rewrites are required.

## GitHub Pages (manual)

1. Publish this repository only after the owner approves the public name, license and contents.
2. In repository Settings → Pages, select GitHub Actions as the build source.
3. Run the **Deploy Pages** workflow manually. It tests, builds, uploads and deploys the static app.
4. Inspect the completed job's URL in a browser, including a mobile viewport and the Zi-hour example. A queued workflow is not a verified live site.
5. Add the verified URL to the README and About field; update release status only after live verification.

CI on push/PR does not deploy. Runtime needs no secrets, database or model keys. Never deploy the parent project directory: it contains private source-reading material outside this open-source package.

The host should use HTTPS. A strict CSP can allow same-origin scripts and styles plus inline style attributes used only for count-bar widths. No third-party resources are needed. This release has no service worker and does not promise offline cold starts.
