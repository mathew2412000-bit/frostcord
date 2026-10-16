/*
 * FrostCord, a Discord client mod
 * Copyright (c) 2026 FrostCord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export interface ScreenFreezeState {
    isFrozen: boolean;
    frozenTimestamp?: number;
    hasActiveStream: boolean;
}
