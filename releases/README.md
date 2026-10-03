# Releases

This folder hosts update manifests and installers for Orig software products.
It is not linked from any page of the site: apps read it directly.

## Addresses

The site answers on `https://www.origai.fr` (main) and on the old
`https://orig-audit.netlify.app`. `_redirects` sends every old-address page to
the new domain with a 301, **except `/releases/*`, which stays 200 on both**:
Tutellia up to v2.0.7 has the old address hardcoded. Keep that exception at
least 12 months after the release that reads the update URL from the database.

From v2.0.7, Tutellia tries in order: the URL saved by the admin in
Administration > Configuration système, then
`https://www.origai.fr/releases/tutellia/latest.json`, then the old address.

## Structure

```
releases/
├── tutellia/
│   ├── latest.json              ← Tauri auto-updater manifest
│   └── Tutellia_x.x.x_x64-setup.exe(.sig)
└── origpdf/
    ├── latest.json              ← Tauri auto-updater manifest
    └── (OrigPDF_x.x.x_x64-setup.exe(.sig), once the first release ships)
```

## OrigPDF

OrigPDF installs check `https://orig-audit.netlify.app/releases/origpdf/latest.json` (served on both domains)
at startup and from Settings.

**Current state (2026-10-03): v0.1.0 published** (Windows, `OrigPDF_0.1.0_x64-setup.exe`),
linked from produits.html. The app is named OrigPDF, without a space.

To publish a release, from `OrigPDF/apps/desktop`:

```powershell
./release.ps1 -Version X.Y.Z -Notes "..."          # build, sign, copy here, write latest.json
./release.ps1 -Version X.Y.Z -Notes "..." -Push    # same, then push the site (Netlify deploys)
```

Do not hand-edit `latest.json` for a real release: the script takes the
signature from the signed installer. OrigPDF has its own signing key
(`%USERPROFILE%\.tauri\origpdf.key`); never sign it with Tutellia's.

## How to publish a new Tutellia release

### 1. Build the installer

```bash
cd tut'aide/web
npm run tauri:build
```

This produces two files in `src-tauri/target/release/bundle/nsis/`:
- `Tutellia_x.x.x_x64-setup.exe`: the installer
- `Tutellia_x.x.x_x64-setup.exe.sig`: the signature (content needed for latest.json)

### 2. Upload the installer

Copy the `.exe` into this folder:
```
releases/tutellia/Tutellia-x.x.x-setup.exe
```

### 3. Update latest.json

Edit `releases/tutellia/latest.json`:
- `version`: new version number (e.g. `"2.1.0"`)
- `pub_date`: today's date in ISO format (e.g. `"2026-05-06T00:00:00Z"`)
- `url`: full URL to the new installer on this site
- `signature`: paste the entire content of the `.sig` file

### 4. Deploy

Push to git. Netlify deploys automatically.

All Tutellia installations will check `latest.json` on next launch and prompt the user to update if the version is newer than what they have installed.
