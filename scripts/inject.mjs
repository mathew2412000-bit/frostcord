/*
 * FrostCord — Local injector for Discord Desktop
 * Injects FrostCord into an existing Discord installation:
 * 1. Finds the Discord resources directory
 * 2. Ensures _app.asar presence and integrity (auto-restore from nupkg if needed)
 * 3. Creates resources/app/ (package.json + index.js) — Electron prefers app/ over app.asar,
 *    which avoids binary replacement and session loss (accounts, voice settings).
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./checkNodeVersion.js";

import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync, copyFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { recoverOriginalAsar } from "./recoverAsar.mjs";

const BASE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST_DIR = join(BASE_DIR, "dist", "desktop");


// ── Locate Discord installations ─────────────────────────────────────────────
function findAllDiscordResources() {
    const platform = process.platform;
    const candidates = [];

    if (platform === "win32") {
        const localAppData = process.env.LOCALAPPDATA || "";

        for (const channel of ["Discord", "DiscordPTB", "DiscordCanary", "DiscordDevelopment"]) {
            const base = join(localAppData, channel);
            if (!existsSync(base)) continue;
            try {
                const versions = readdirSync(base)
                    .filter(d => /^app-\d+\.\d+\.\d+$/.test(d))
                    .sort()
                    .reverse();
                for (const ver of versions) {
                    candidates.push(join(base, ver, "resources"));
                }
            } catch { }
        }
    } else if (platform === "darwin") {
        const home = process.env.HOME || "";
        const appBases = [
            "/Applications",
            join(home, "Applications")
        ];
        const appNames = [
            "Discord.app",
            "Discord PTB.app",
            "Discord Canary.app",
            "Discord Development.app"
        ];

        for (const base of appBases) {
            for (const app of appNames) {
                candidates.push(join(base, app, "Contents", "Resources"));
            }
        }
    } else if (platform === "linux") {
        const home = process.env.HOME || "";

        // Standard system / package manager paths
        const channels = ["discord", "discord-ptb", "discord-canary", "discord-development", "Discord", "DiscordPTB", "DiscordCanary", "DiscordDevelopment"];
        for (const prefix of ["/usr/share", "/usr/lib", "/usr/lib64", "/opt"]) {
            for (const ch of channels) {
                candidates.push(join(prefix, ch, "resources"));
            }
        }

        // User local paths
        for (const ch of channels) {
            candidates.push(join(home, ".local/share", ch, "resources"));
            candidates.push(join(home, ".local/bin", ch, "resources"));
        }

        // Flatpak paths
        const flatpakAppIds = [
            "com.discordapp.Discord",
            "com.discordapp.DiscordCanary",
            "com.discordapp.DiscordPTB",
            "com.discordapp.DiscordDevelopment"
        ];
        for (const appId of flatpakAppIds) {
            const discordFolder = appId.replace("com.discordapp.", "").toLowerCase();
            candidates.push(join(home, ".local/share/flatpak/app", appId, "current/active/files", discordFolder, "resources"));
            candidates.push(join(home, ".local/share/flatpak/app", appId, "current/active/files/share", discordFolder, "resources"));
            candidates.push(join("/var/lib/flatpak/app", appId, "current/active/files", discordFolder, "resources"));
            candidates.push(join("/var/lib/flatpak/app", appId, "current/active/files/share", discordFolder, "resources"));
            candidates.push(join(home, ".var/app", appId, "data", discordFolder, "resources"));
        }

        // Snap paths
        for (const ch of ["discord", "discord-canary", "discord-ptb"]) {
            candidates.push(join("/snap", ch, "current/usr/share", ch, "resources"));
            candidates.push(join("/snap", ch, "current/opt", ch, "resources"));
        }

        // Dynamic / app-X.Y.Z folders
        for (const base of ["/opt/discord", "/opt/Discord", join(home, ".local/share/discord"), join(home, ".dvm")]) {
            if (existsSync(base)) {
                try {
                    const entries = readdirSync(base);
                    for (const entry of entries) {
                        if (entry.startsWith("app-")) {
                            candidates.push(join(base, entry, "resources"));
                        }
                    }
                } catch { }
            }
        }
    }

    return [...new Set(candidates)].filter(p => existsSync(p));
}

// ── Check dist/ exists ───────────────────────────────────────────────────────
function checkBuild() {
    const patcherPath = join(DIST_DIR, "patcher.js");
    if (!existsSync(patcherPath)) {
        console.error("\x1b[31m[FrostCord] dist/desktop/patcher.js not found!\x1b[0m");
        console.error("\x1b[33m           Run 'pnpm build' first, then try again.\x1b[0m");
        process.exit(1);
    }
}

// ── Inject ───────────────────────────────────────────────────────────────────
function inject(resourcesDir) {
    const appDirPath = join(resourcesDir, "app");

    // Remove third-party mod files and old fake app.asar directories
    for (const modAsar of ["vencord.asar", "equicord.asar", "betterdiscord.asar"]) {
        const p = join(resourcesDir, modAsar);
        if (existsSync(p)) {
            try { rmSync(p, { force: true }); } catch {}
        }
    }

    const appAsarPath = join(resourcesDir, "app.asar");
    if (existsSync(appAsarPath)) {
        try {
            const stat = statSync(appAsarPath);
            if (stat.isDirectory()) {
                rmSync(appAsarPath, { recursive: true, force: true });
            }
        } catch {}
    }

    // Step 1: Ensure presence of original _app.asar (> 1MB)
    const hasOriginal = recoverOriginalAsar(resourcesDir);
    if (!hasOriginal) {
        console.error(`\x1b[31m[FrostCord] Could not locate or extract original Discord archive for ${resourcesDir}!\x1b[0m`);
        return false;
    }

    // Get Discord package name
    let appPkgName = "discord";
    try {
        const lowerRes = resourcesDir.toLowerCase();
        if (lowerRes.includes("canary")) appPkgName = "discordcanary";
        else if (lowerRes.includes("ptb")) appPkgName = "discordptb";
        else if (lowerRes.includes("development")) appPkgName = "discorddevelopment";
    } catch {}

    const patcherPath = join(DIST_DIR, "patcher.js");
    const preloadPath = join(DIST_DIR, "preload.js");
    const rendererPath = join(DIST_DIR, "renderer.js");
    const rendererCssPath = join(DIST_DIR, "renderer.css");

    // Verify all required files exist
    for (const [name, path] of [
        ["patcher.js", patcherPath],
        ["preload.js", preloadPath],
        ["renderer.js", rendererPath],
        ["renderer.css", rendererCssPath]
    ]) {
        if (!existsSync(path)) {
            console.error(`\x1b[31m[FrostCord] ${name} not found in dist/desktop/!\x1b[0m`);
            console.error(`\x1b[33m           Run 'pnpm build' first.\x1b[0m`);
            return false;
        }
    }

    // Step 2: Create app/ folder with package.json + index.js + all FrostCord files
    // Electron prefers app/ over app.asar — no binary replacement,
    // no session reload, no loss of accounts or voice settings.
    try {
        mkdirSync(appDirPath, { recursive: true });
    } catch (e) {
        console.error(`\x1b[31m[FrostCord] Failed to create app/: ${e.message}\x1b[0m`);
        return false;
    }

    const packageJson = JSON.stringify({ name: appPkgName, main: "index.js" }, null, 2);
    const indexJs = `// FrostCord loader — generated by pnpm inject\nrequire("./patcher.js");\n`;

    try {
        writeFileSync(join(appDirPath, "package.json"), packageJson, "utf-8");
        writeFileSync(join(appDirPath, "index.js"), indexJs, "utf-8");

        // Copy all FrostCord desktop files to app/
        console.log(`\x1b[36m[FrostCord] Copying FrostCord files to app/...\x1b[0m`);
        copyFileSync(patcherPath, join(appDirPath, "patcher.js"));
        copyFileSync(preloadPath, join(appDirPath, "preload.js"));
        copyFileSync(rendererPath, join(appDirPath, "renderer.js"));
        copyFileSync(rendererCssPath, join(appDirPath, "renderer.css"));

        // Copy multi-instance icons if they exist
        const iconsDir = join(DIST_DIR, "multi-instance-icons");
        if (existsSync(iconsDir)) {
            const targetIconsDir = join(appDirPath, "multi-instance-icons");
            mkdirSync(targetIconsDir, { recursive: true });
            for (const iconFile of readdirSync(iconsDir)) {
                copyFileSync(join(iconsDir, iconFile), join(targetIconsDir, iconFile));
            }
        }
    } catch (e) {
        console.error(`\x1b[31m[FrostCord] Failed to write app/: ${e.message}\x1b[0m`);
        return false;
    }

    console.log(`\x1b[32m[FrostCord] Successfully injected into: ${resourcesDir}\x1b[0m`);
    return true;
}


// ── Main ─────────────────────────────────────────────────────────────────────
checkBuild();

const allResources = findAllDiscordResources();
if (allResources.length === 0) {
    console.error("\x1b[31m[FrostCord] No Discord installations found!\x1b[0m");
    process.exit(1);
}

console.log(`[FrostCord] ${allResources.length} Discord installation(s) found:`);
let injectedCount = 0;
for (const res of allResources) {
    console.log(`\n  → ${res}`);
    if (inject(res)) injectedCount++;
}
console.log(`\n\x1b[32m[FrostCord] ${injectedCount}/${allResources.length} injection(s) successful.\x1b[0m`);
console.log("\x1b[36m[FrostCord] Launch Discord to start FrostCord.\x1b[0m");
