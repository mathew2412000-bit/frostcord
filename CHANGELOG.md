# Changelog

All notable changes to FrostCord will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.29.5] - 2026-10-17

### Added
- Complete FrostCord branding throughout the application
- NSIS-based Windows installer (`FrostCordSetup.exe`)
- GitHub Actions workflow for automated builds
- Professional dark-themed installer with ice-blue accents
- Discord installation selection (Stable, PTB, Canary, Development)
- Repair and Uninstall functionality
- Desktop injection verification and logging
- Browser extension builds (Firefox and Chrome)

### Changed
- Replaced all Nightcord branding with FrostCord
- Fixed desktop injection to copy files instead of using absolute paths
- Updated installer to use NSIS instead of electron-builder
- Desktop loader now uses relative paths for installed files
- Removed dependency on development folders after installation

### Fixed
- Desktop injection now copies all required files to Discord's `resources/app/`
- No longer references absolute development paths
- Build system verified and error-free
- Chrome extension preserved and working

### Removed
- FrostCord AI features
- Notification logs and settings
- Tutorial system from plugin cards
- Electron-builder configuration (replaced with NSIS)

### Security
- No hardcoded developer paths remain
- All sensitive paths removed from source code
- Desktop loader uses only installed files

### Installation
- Users no longer need Node.js, pnpm, or source code
- Single `FrostCordSetup.exe` installer
- Automatic Discord installation detection
- Clean uninstallation that restores Discord

[1.29.5]: https://github.com/mathew2412000-bit/frostcord/releases/tag/v1.29.5
