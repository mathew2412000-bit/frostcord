# FrostCord v1.29.5 Release Notes

## Overview
FrostCord v1.29.5 is the first public release of FrostCord, a Discord client mod with advanced features, themes, and plugins.

## Installation

### Windows (Recommended)
1. Download `FrostCordSetup.exe` from the [Releases](https://github.com/mathew2412000-bit/frostcord/releases) page
2. Run the installer
3. Select your Discord installation (Stable, PTB, Canary, or Development)
4. Follow the installation wizard
5. Launch Discord - FrostCord will load automatically

### Browser Extension
- **Chrome/Edge**: Load the unpacked extension from `dist/browser/chromium-unpacked`
- **Firefox**: Load the unpacked extension from `dist/browser/firefox-unpacked`

## New Features
- **Complete FrostCord Branding**: Full rebrand from Nightcord to FrostCord
- **Windows Installer**: Professional NSIS-based installer with dark theme
- **Discord Installation Selection**: Choose which Discord version to use
- **Repair Functionality**: Detects and repairs existing installations
- **Clean Uninstall**: Removes FrostCord and restores Discord automatically

## Changes
- Fixed desktop injection to use relative paths instead of absolute development paths
- Desktop loader now uses only installed files
- Removed dependency on Node.js, pnpm, or source code for users
- All user-facing text updated to FrostCord branding

## Fixes
- Desktop injection now successfully copies all required files
- No more hardcoded developer paths in source code
- Build system verified and error-free
- Chrome extension preserved and working

## Removed
- FrostCord AI features
- Notification logs and settings
- Tutorial system from plugin cards

## System Requirements
- **Windows**: Windows 10 or 11
- **Discord**: Discord Stable, PTB, Canary, or Development
- **No dependencies**: Users don't need Node.js, pnpm, or Python

## Known Issues
- NSIS installer cannot be built locally without NSIS installation (use GitHub Actions)
- Desktop injection requires running Discord once before first installation

## Credits
Based on [Vencord](https://github.com/Vencord/Vencord) and [Equicord](https://github.com/Equicord/Equicord).

## License
GPL-3.0-or-later - see [LICENSE](LICENSE) for details.

## Support
- [GitHub Issues](https://github.com/mathew2412000-bit/frostcord/issues)
- [Documentation](README.md)
