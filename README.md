# Regen Service Report

Inverter service report app for Regen Renewables (Pvt) Ltd. Fill the service checklist on site, read the inverter nameplate from a photo, add photos and signatures, and create the A4 PDF report.

## Files (keep them all in the top level of the repository, no folders)

| File | Purpose |
|---|---|
| index.html | The app |
| sw.js | Offline support (only manages this app's own storage) |
| manifest.webmanifest | Install settings (name, icon) |
| icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png, favicon-32.png | App icons (home screen, Android adaptive icon, iPhone, browser tab) |

## Publish on GitHub Pages

1. Create a new repository, for example `Service-Report` (use a new repository, not one that already hosts another app).
2. Upload all files from the zip to the top level of the repository.
3. Settings → Pages → Deploy from branch → `main` / root.
4. Open `https://<your-account>.github.io/Service-Report/` and use "Install app" / "Add to Home screen".

## Nameplate reading

- **On-device (default):** text recognition runs in the browser. It downloads about 10 MB the first time, then works offline. It needs a sharp, well-lit photo taken straight on; frame just the plate.
- **Claude (optional):** add an Anthropic API key under *Nameplate reading settings* on the Reports screen. Claude reads plates with glare, angles and small print far better. The key is stored only in that browser.
- The barcode on the plate is also read for the serial number where the phone supports it.

Values are always shown for checking before they are added to the report.

## Updating

When you change `index.html`, also change the version number in the `const CACHE` line near the top of `sw.js` (for example `'1.0.0'` → `'1.0.1'`) so phones pick up the new version.
