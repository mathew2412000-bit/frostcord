/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { debounce } from "@shared/debounce";
import { IpcEvents } from "@shared/IpcEvents";
import { contextBridge, webFrame } from "electron/renderer";

import VencordNative, { invoke, sendSync } from "./VencordNative";

contextBridge.exposeInMainWorld("VencordNative", VencordNative);
contextBridge.exposeInMainWorld("EquicordNative", VencordNative);
contextBridge.exposeInMainWorld("FrostCordNative", VencordNative);

// Discord
if (location.protocol !== "data:") {
    console.log("[FrostCord] Preload: Initializing file watchers...");
    invoke(IpcEvents.INIT_FILE_WATCHERS);

    if (IS_DISCORD_DESKTOP) {
        console.log("[FrostCord] Preload: Requesting renderer.js...");
        const rendererJs = sendSync<string>(IpcEvents.PRELOAD_GET_RENDERER_JS);
        if (rendererJs) {
            console.log("[FrostCord] Preload: Executing renderer.js, size:", rendererJs.length);
            webFrame.executeJavaScript(rendererJs).then(() => {
                console.log("[FrostCord] Preload: renderer.js executed successfully");
            }).catch(e => {
                console.error("[FrostCord] Preload: Failed to execute renderer.js:", e);
            });
        } else {
            console.error("[FrostCord] Preload: renderer.js is empty or not loaded!");
        }
        if (process.env.DISCORD_PRELOAD) {
            try {
                console.log("[FrostCord] Preload: Loading original Discord preload:", process.env.DISCORD_PRELOAD);
                require(process.env.DISCORD_PRELOAD);
            } catch (e) {
                console.error("[FrostCord] Error loading original Discord preload:", e);
            }
        }
    }
} // Monaco popout
else {
    contextBridge.exposeInMainWorld("setCss", debounce(VencordNative.quickCss.set));
    contextBridge.exposeInMainWorld("getCurrentCss", VencordNative.quickCss.get);
    contextBridge.exposeInMainWorld("getTheme", VencordNative.quickCss.getEditorTheme);
}
