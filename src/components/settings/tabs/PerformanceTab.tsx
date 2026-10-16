/*
 * FrostCord, a Discord client mod
 * Copyright (c) 2026 FrostCord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Card } from "@components/Card";
import { Divider } from "@components/Divider";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { Margins } from "@utils/margins";
import { React } from "@webpack/common";

function PerformanceTab() {
    return (
        <SettingsTab>
            <Heading className={Margins.top16}>Performance</Heading>
            <Paragraph className={Margins.bottom20}>
                Monitor and optimize Discord's performance for a smoother experience.
            </Paragraph>

            <Card className={Margins.bottom16}>
                <Heading tag="h3" style={{ marginBottom: 8 }}>Performance Monitoring</Heading>
                <Paragraph style={{ marginBottom: 12 }}>
                    FPS counter and memory usage monitoring coming soon.
                </Paragraph>
                <Paragraph style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Real-time performance metrics will help you identify and fix lag issues.
                </Paragraph>
            </Card>

            <Divider className={Margins.bottom16} />

            <Heading>Optimizations</Heading>
            <Paragraph className={Margins.bottom16}>
                Performance optimization features coming soon.
            </Paragraph>

            <Card className={Margins.bottom16}>
                <Paragraph style={{ color: "var(--text-muted)" }}>
                    Rendering optimizations, animation reduction, and resource management will be available in a future update.
                </Paragraph>
            </Card>
        </SettingsTab>
    );
}

export default wrapTab(PerformanceTab, "Performance");
