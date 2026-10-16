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
import { React, UserStore } from "@webpack/common";

function AccountTab() {
    const currentUser = UserStore.getCurrentUser();

    return (
        <SettingsTab>
            <Heading className={Margins.top16}>Account</Heading>
            <Paragraph className={Margins.bottom20}>
                Manage your Discord account settings and statistics.
            </Paragraph>

            <Card className={Margins.bottom16}>
                <Heading tag="h3" style={{ marginBottom: 8 }}>Current Account</Heading>
                <Paragraph style={{ marginBottom: 12 }}>
                    {currentUser?.username || "Unknown"} ({currentUser?.discriminator || "0000"})
                </Paragraph>
                <Paragraph style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    ID: {currentUser?.id || "Unknown"}
                </Paragraph>
            </Card>

            <Divider className={Margins.bottom16} />

            <Heading>Statistics</Heading>
            <Paragraph className={Margins.bottom16}>
                Account activity tracking and statistics are coming soon.
            </Paragraph>

            <Card className={Margins.bottom16}>
                <Paragraph style={{ color: "var(--text-muted)" }}>
                    Message count, time spent, and activity history tracking will be available in a future update.
                </Paragraph>
            </Card>

            <Divider className={Margins.bottom16} />

            <Heading>Account Switcher</Heading>
            <Paragraph className={Margins.bottom16}>
                Quick account switching feature coming soon.
            </Paragraph>

            <Card className={Margins.bottom16}>
                <Paragraph style={{ color: "var(--text-muted)" }}>
                    Switch between multiple Discord accounts quickly without logging out.
                </Paragraph>
            </Card>
        </SettingsTab>
    );
}

export default wrapTab(AccountTab, "Account");
