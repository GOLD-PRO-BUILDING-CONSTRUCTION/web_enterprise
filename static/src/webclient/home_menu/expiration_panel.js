/** @odoo-module **/

import { useService } from "@web/core/utils/hooks";
import { Transition } from "@web/core/transition";
import { _t } from "@web/core/l10n/translation";
import { Component, useState, useRef } from "@odoo/owl";

/**
 * Expiration panel
 *
 * Component representing the banner located on top of the home menu.
 * Modified to reflect unlimited subscription (no expiration).
 * @extends Component
 */
export class ExpirationPanel extends Component {
    setup() {
        this.subscription = useState(useService("enterprise_subscription"));

        this.state = useState({
            displayRegisterForm: false,
        });

        this.inputRef = useRef("input");
    }

    get buttonText() {
        return this.subscription.lastRequestStatus === "error" ? _t("Retry") : _t("Register");
    }

    get alertType() {
        // Since the subscription is unlimited, we can always return "success"
        return "success";
    }

    get expirationMessage() {
        // No expiration, so we provide a message for unlimited access
        return _t("This database has unlimited access.");
    }

    showRegistrationForm() {
        this.state.displayRegisterForm = !this.state.displayRegisterForm;
    }

    async onCodeSubmit() {
        const enterpriseCode = this.inputRef.el.value;
        if (!enterpriseCode) {
            return;
        }
        await this.subscription.submitCode(enterpriseCode);
        if (this.subscription.lastRequestStatus === "success") {
            this.state.displayRegisterForm = false;
        } else {
            this.state.buttonText = _t("Retry");
        }
    }
}

ExpirationPanel.template = "DatabaseExpirationPanel";
ExpirationPanel.props = {};
ExpirationPanel.components = { Transition };
