/*
 * FrostCord Installer Build Script
 * Builds the NSIS installer for FrostCord
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const rootDir = process.cwd();
const nsiPath = join(rootDir, "installer.nsi");

console.log("[FrostCord] Building NSIS installer...");

// Check if NSIS is installed
try {
    execSync("makensis --version", { stdio: "pipe" });
    console.log("[FrostCord] NSIS found");
} catch (e) {
    console.error("[FrostCord] ERROR: NSIS (makensis) not found!");
    console.error("[FrostCord] Please install NSIS from https://nsis.sourceforge.io/");
    console.error("[FrostCord] Or use GitHub Actions which installs NSIS automatically");
    process.exit(1);
}

// Check if installer.nsi exists
if (!existsSync(nsiPath)) {
    console.error("[FrostCord] ERROR: installer.nsi not found at:", nsiPath);
    process.exit(1);
}

// Check if dist/desktop exists
const desktopDist = join(rootDir, "dist", "desktop");
if (!existsSync(desktopDist)) {
    console.error("[FrostCord] ERROR: dist/desktop not found. Run 'pnpm build' first.");
    process.exit(1);
}

// Build the installer
try {
    console.log("[FrostCord] Running makensis...");
    execSync(`makensis "${nsiPath}"`, { stdio: "inherit" });
    console.log("[FrostCord] Installer built successfully: FrostCordSetup.exe");
} catch (e) {
    console.error("[FrostCord] ERROR: Failed to build installer:", e.message);
    process.exit(1);
}
