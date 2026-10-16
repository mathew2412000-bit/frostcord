# FrostCord

A Discord client mod with advanced features, themes, and plugins.

## Features

- **Plugin System**: Extensive plugin library with customization options
- **Theme Support**: Beautiful themes with custom CSS
- **Performance Improvements**: Optimized for better Discord performance
- **Quick CSS**: Real-time CSS editing and preview
- **Backup & Restore**: Easy settings backup and restoration
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Installation

### Windows (Installer)

1. Download `FrostCordSetup.exe` from the [Releases](https://github.com/mathew2412000-bit/frostcord/releases) page
2. Run the installer
3. Select your Discord installation (Stable, PTB, Canary, or Development)
4. Follow the installation wizard
5. Launch Discord - FrostCord will load automatically

### Windows (Manual)

1. Install [Node.js](https://nodejs.org/) (v18 or later)
2. Install [pnpm](https://pnpm.io/): `npm install -g pnpm`
3. Clone this repository
4. Run `pnpm install`
5. Run `pnpm build`
6. Run `pnpm inject`

### Browser Extension

1. Build the extension: `pnpm buildWeb`
2. Load the unpacked extension in Chrome/Edge: `dist/browser/chromium-unpacked`
3. Load the unpacked extension in Firefox: `dist/browser/firefox-unpacked`

## Building

```bash
# Install dependencies
pnpm install

# Build everything
pnpm build

# Build browser extension only
pnpm buildWeb

# Build desktop only
pnpm buildDesktop

# Inject into Discord
pnpm inject

# Uninject from Discord
pnpm uninject
```

## Development

```bash
# Watch mode for development
pnpm watch

# Watch browser extension
pnpm watchWeb

# Generate plugin list
pnpm generatePluginJson
```

## Configuration

FrostCord settings are stored in:
- **Windows**: `%LOCALAPPDATA%\FrostCord`
- **macOS**: `~/Library/Application Support/FrostCord`
- **Linux**: `~/.config/FrostCord`

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

GPL-3.0-or-later - see [LICENSE](LICENSE) for details.

## Credits

Based on [Vencord](https://github.com/Vencord/Vencord) and [Equicord](https://github.com/Equicord/Equicord).

## Support

- [GitHub Issues](https://github.com/mathew2412000-bit/frostcord/issues)
- [Discord Server](https://discord.gg/yourserver)
