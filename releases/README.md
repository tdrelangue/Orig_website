# Releases

This folder hosts update manifests and installers for Orig software products.

## Structure

```
releases/
└── tutellia/
    ├── latest.json              ← Tauri auto-updater manifest
    └── Tutellia-x.x.x-setup.exe  ← Windows installer (upload manually after each build)
```

## How to publish a new Tutellia release

### 1. Build the installer

```bash
cd tut'aide/web
npm run tauri:build
```

This produces two files in `src-tauri/target/release/bundle/nsis/`:
- `Tutellia_x.x.x_x64-setup.exe` — the installer
- `Tutellia_x.x.x_x64-setup.exe.sig` — the signature (content needed for latest.json)

### 2. Upload the installer

Copy the `.exe` into this folder:
```
releases/tutellia/Tutellia-x.x.x-setup.exe
```

### 3. Update latest.json

Edit `releases/tutellia/latest.json`:
- `version` → new version number (e.g. `"2.1.0"`)
- `pub_date` → today's date in ISO format (e.g. `"2026-05-06T00:00:00Z"`)
- `url` → full URL to the new installer on this site
- `signature` → paste the entire content of the `.sig` file

### 4. Deploy

Push to git — Netlify deploys automatically.

All Tutellia installations will check `latest.json` on next launch and prompt the user to update if the version is newer than what they have installed.
