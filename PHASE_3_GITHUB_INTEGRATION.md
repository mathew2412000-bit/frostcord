# Phase 3: GitHub Integration and Automated Windows Builds

## Status: Ready for Implementation

Phase 2 is complete. FrostCord desktop injection is working, the NSIS installer is configured, and all branding is updated to FrostCord.

## Current State

### Completed (Phase 1 & 2):
- ✅ Desktop injection fixed - copies files to Discord resources/app/
- ✅ Injector successfully tested - injected into 3 Discord installations
- ✅ All user-facing Nightcord branding replaced with FrostCord
- ✅ NSIS installer configured with professional dark theme
- ✅ Install, Repair, and Uninstall functionality implemented
- ✅ Desktop loader uses installed files only (no dev paths)
- ✅ Conflicting electron-builder configuration disabled
- ✅ Build system working - no errors
- ✅ Chrome extension preserved and working

### Files Modified:
- `scripts/inject.mjs` - Fixed to copy files instead of using absolute paths
- `src/main/patcher.ts` - Added verification logging
- `src/main/ipcMain.ts` - Added renderer.js loading verification
- `src/preload.ts` - Added initialization logging
- `installer.nsi` - Complete NSIS installer with dark theme
- `electron-builder.config.cjs` - Disabled (NSIS used instead)
- `package.json` - Updated branding and scripts
- `static/views/about.html` - Updated to FrostCord
- `static/views/updater/index.html` - Updated to FrostCord
- `static/views/splash.html` - Updated to FrostCord
- `.github/workflows/build.yml` - GitHub Actions workflow configured

## Phase 3: GitHub Integration Tasks

### 1. Create GitHub Repository
- Create a new GitHub repository named `FrostCord`
- Update repository URLs in:
  - `package.json` (homepage, bugs, repository)
  - `README.md` (links)
  - `installer.nsi` (HELPURL, UPDATEURL, ABOUTURL)
  - `static/views/about.html` (links)

### 2. Configure GitHub Secrets
- No secrets required for basic builds
- For automated releases, you may want:
  - `GITHUB_TOKEN` (automatically provided by GitHub Actions)

### 3. Test GitHub Actions Workflow
The workflow at `.github/workflows/build.yml` is ready and will:
- Install Node.js 18 and pnpm
- Build FrostCord (browser + desktop)
- Build NSIS installer on Windows runners
- Upload artifacts for download
- Attach installer to releases (when tagged)

### 4. Create First Release
Once pushed to GitHub:
1. Tag a commit: `git tag v1.29.5`
2. Push tag: `git push origin v1.29.5`
3. Create GitHub Release from the tag
4. GitHub Actions will automatically build and attach `FrostCordSetup.exe`

### 5. Verify Installer Build
- Download `FrostCordSetup.exe` from GitHub Releases
- Test installation on a clean Windows machine
- Verify Discord Desktop injection works
- Verify Uninstall restores Discord

## Testing Status

### ✅ Tested:
- Desktop injection (`pnpm inject`) - SUCCESS
- Files copied to Discord resources/app/ - SUCCESS
- Build system (`pnpm build`) - SUCCESS
- No build errors - SUCCESS

### ⚠️ Not Tested (Requires Windows + NSIS):
- NSIS installer build (requires NSIS installation)
- `FrostCordSetup.exe` execution
- Installer UI (Discord selection, installation progress)
- Uninstaller functionality
- GitHub Actions automated build

## Notes

### Why NSIS Instead of electron-builder:
- FrostCord injects into existing Discord installations
- Does not create a standalone Electron app
- electron-builder is for standalone apps, not Discord injection
- NSIS provides better control over Discord installation detection

### User Installation Flow:
1. User downloads `FrostCordSetup.exe` from GitHub Releases
2. No Node.js, pnpm, or source code required
3. Installer copies FrostCord files to `%LOCALAPPDATA%\FrostCord`
4. User selects Discord installation (Stable, PTB, Canary, or Dev)
5. Installer copies FrostCord files to Discord's `resources/app/`
6. User launches Discord - FrostCord loads automatically
7. Uninstaller removes FrostCord and restores Discord

### File Structure After Installation:
```
%LOCALAPPDATA%\FrostCord\
  patcher.js
  preload.js
  renderer.js
  renderer.css
  multi-instance-icons\
  Uninstall.exe

%LOCALAPPDATA%\Discord\app-X.X.XXXX\resources\app\
  index.js (loader)
  package.json
  patcher.js
  preload.js
  renderer.js
  renderer.css
  multi-instance-icons\
```

## Next Steps

1. **Create GitHub repository** with proper branding
2. **Update all placeholder URLs** to point to your repository
3. **Push code to GitHub**
4. **Create a release tag** to trigger GitHub Actions
5. **Download and test `FrostCordSetup.exe`**
6. **Iterate based on testing results**

## Authorization Required

To proceed with Phase 3, you need to:
1. Create a GitHub account (if you don't have one)
2. Create a new repository named `FrostCord`
3. Authorize GitHub Actions in your repository settings
4. Provide the repository URL so I can update placeholder URLs

I cannot create the repository or push code without your explicit authorization.
