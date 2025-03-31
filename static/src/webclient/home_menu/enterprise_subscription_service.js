/** @odoo-module **/

import { registry } from "@web/core/registry";
import { session } from "@web/session";
import { browser } from "@web/core/browser/browser";
import { formatDate } from "@web/core/l10n/dates";
import { useService } from "@web/core/utils/hooks";
import { _t } from "@web/core/l10n/translation";
import { ExpirationPanel } from "./expiration_panel";
import { cookie } from "@web/core/browser/cookie";

const { DateTime } = luxon;
import { Component, xml, useState } from "@odoo/owl";

function daysUntil(datetime) {
    const duration = datetime.diff(DateTime.utc(), "days");
    return Math.round(duration.values.days);
}

export class SubscriptionManager {
    constructor(env, { rpc, orm, notification }) {
        this.env = env;
        this.rpc = rpc;
        this.orm = orm;
        this.notification = notification;
        
        // Set a distant future expiration date or skip expiration logic entirely
        this.expirationDate = DateTime.utc().plus({ years: 100 }); // Unlimited subscription
        
        this.expirationReason = session.expiration_reason;
        this.hasInstalledApps = "notification_type" in session;
        this.warningType = session.warning;
        this.lastRequestStatus = null;
        this.isWarningHidden = cookie.get("oe_instance_hide_panel");
    }

    get formattedExpirationDate() {
        return formatDate(this.expirationDate, { format: "DDD" });
    }

    get daysLeft() {
        return daysUntil(this.expirationDate);
    }

    get unregistered() {
        // Always return false since we are considering it unlimited
        return false;
    }

    hideWarning() {
        // Hide warning permanently
        cookie.set("oe_instance_hide_panel", true, 100 * 365 * 24 * 60 * 60);
        this.isWarningHidden = true;
    }

    async buy() {
        // No need to redirect or do anything related to purchasing
    }

    async submitCode(enterpriseCode) {
        // Skip code submission logic as the subscription is considered unlimited
    }

    async checkStatus() {
        // Skip status check logic
    }

    async sendUnlinkEmail() {
        // Skip unlink email logic
    }

    async renew() {
        // No need to renew since the subscription is unlimited
    }

    async upsell() {
        // No need to upsell since the subscription is unlimited
    }
}

// Rest of the code remains unchanged
class ExpiredSubscriptionBlockUI extends Component {
    setup() {
        this.subscription = useState(useService("enterprise_subscription"));
    }
}
ExpiredSubscriptionBlockUI.props = {};
ExpiredSubscriptionBlockUI.template = xml`
<t t-if="false">
</t>`;
ExpiredSubscriptionBlockUI.components = { ExpirationPanel };

export const enterpriseSubscriptionService = {
    name: "enterprise_subscription",
    dependencies: ["orm", "rpc", "notification"],
    start(env, { rpc, orm, notification }) {
        registry
            .category("main_components")
            .add("expired_subscription_block_ui", { Component: ExpiredSubscriptionBlockUI });
        return new SubscriptionManager(env, { rpc, orm, notification });
    },
};

registry.category("services").add("enterprise_subscription", enterpriseSubscriptionService);
