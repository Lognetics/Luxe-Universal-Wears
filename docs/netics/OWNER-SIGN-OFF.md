# Owner sign-off checklist

Owner: ____________________  Date: ____________________  Approved by: ____________________

This checklist prevents the AI from turning polished website copy or generated catalogue data into an operational promise. `Required` items block production launch.

## 1. Identity and ownership

- [ ] **Required:** Legal trading name is confirmed.
- [ ] **Required:** The authorised NETICS workspace owner email is confirmed and accessible.
- [ ] **Required:** `https://www.luxeuniversalwears.com` and `https://luxeuniversalwears.com` are controlled by the business.
- [ ] **Required:** WhatsApp `+234 817 393 8770` is controlled by the business and can receive the NETICS verification code.
- [ ] Confirm whether the public address `Shop 313, Favour Line, Ultra Modern Market, Utako, Abuja` is current and customer-facing.
- [ ] Confirm or remove the website claims for Wuse II and Port Harcourt locations.
- [ ] Confirm whether “founded in 1998” is accurate.

## 2. Catalogue, pricing and inventory

- [ ] **Required:** Review the current 316-product repository catalogue.
- [ ] **Required:** Confirm every price is an approved selling price in NGN.
- [ ] **Required:** Confirm whether numeric `stock` values are real inventory, estimates or demo data.
- [ ] **Required:** Decide who updates NETICS when a product, price, size, colour or stock value changes.
- [ ] Confirm the 15 populated categories and decide whether the four empty categories — Watches, Bangles, Ties and Belts — should stay visible.
- [ ] Confirm whether discounts and `comparePrice` values can be quoted by AI.
- [ ] Confirm whether product photography and descriptions may be used in customer replies.

If stock is not connected to a live inventory system, configure the AI to say “shown as available” and require human confirmation before accepting payment.

## 3. Orders and payments

- [ ] **Required:** Choose the real order-acceptance route: NETICS order, WhatsApp confirmation, checkout, or a staged combination.
- [ ] **Required:** Confirm which payment providers are actually live. The repository currently states that Paystack, Flutterwave, Stripe, PayPal and bank-transfer selectors are UI only.
- [ ] **Required:** Provide the approved payment-link process. Never place private keys or bank credentials in the knowledge base.
- [ ] **Required:** Define when an order changes from `pending` to `paid`, and require a verified provider webhook for that change.
- [ ] Confirm cancellation, failed-payment, duplicate-payment and refund procedures.
- [ ] Confirm whether AI-created orders require a human review before fulfilment.

The AI must never announce “payment received” based on a screenshot, customer statement or unverified redirect.

## 4. Delivery and collection

- [ ] **Required:** Confirm delivery zones, prices and carriers.
- [ ] Confirm or replace the website claims: same-day Abuja; next-day Port Harcourt/major cities; 2–4 days nationwide.
- [ ] Confirm or replace free delivery over `NGN 150,000`.
- [ ] Confirm whether international delivery is active and which countries are excluded.
- [ ] Confirm pickup locations and pickup hours.
- [ ] Define what happens after a delayed, lost or damaged delivery.

## 5. Returns, exchanges and alterations

- [ ] **Required:** Confirm the ready-to-wear return/exchange window.
- [ ] Confirm the website claim of 14 days, unworn, tags attached.
- [ ] Confirm which products are final sale and whether sale items can be returned.
- [ ] Confirm that bespoke pieces are final sale and define the alteration/remake remedy.
- [ ] Define proof-of-purchase, return shipping and refund timelines.

## 6. Bespoke, wedding and corporate work

- [ ] **Required:** Confirm the services actually offered.
- [ ] Confirm or replace the claimed 8–12 week bespoke timeline and 2–3 fittings.
- [ ] Confirm consultation locations, virtual consultation availability and any booking fee/deposit.
- [ ] Confirm who receives bespoke and corporate leads.
- [ ] Set a real response SLA; do not promise “within 24 hours” unless it is staffed.
- [ ] Define minimum quantities, quotation validity and deposit rules for corporate orders.

## 7. Customer support and WhatsApp

- [ ] **Required:** Name the human escalation owner and backup.
- [ ] **Required:** Confirm staffed hours and expected response time.
- [ ] **Required:** Decide which requests create an urgent alert: payment problem, delivery failure, complaint, high-value order, bespoke deadline, corporate quote.
- [ ] Complete the NETICS WhatsApp verification with the owner present.
- [ ] Test website-to-WhatsApp handoff on Android, iPhone and desktop WhatsApp Web.
- [ ] Approve the opt-in and privacy wording.

## 8. Voice and languages

- [ ] Decide whether this business needs phone AI at launch. Website chat and WhatsApp can launch independently.
- [ ] Approve English only or English plus Nigerian Pidgin.
- [ ] Provide pronunciations for the brand, staff names and product names.
- [ ] Approve the greeting and human-handoff message.

## 9. Privacy, consent and retention

- [ ] **Required:** Publish real Privacy and Terms pages; the current footer labels are plain text, not policies.
- [ ] State which customer fields NETICS may collect and why.
- [ ] Define retention and deletion requests.
- [ ] Confirm who may view transcripts, customer details and orders.
- [ ] Never request card PINs, CVVs, passwords, OTPs or government IDs in chat.

## 10. Final approval

- [ ] The owner reviewed `KNOWLEDGE-BASE.md` line by line.
- [ ] The owner approved the imported catalogue totals and a sample of at least 20 products.
- [ ] All launch scenarios in `AGENT-RUNBOOK.md` passed.
- [ ] Test data was removed or clearly labelled.
- [ ] The Vercel Production agent ID refers to the approved Luxe agent, not a demo tenant.
- [ ] The owner accepts the launch and rollback plan.
