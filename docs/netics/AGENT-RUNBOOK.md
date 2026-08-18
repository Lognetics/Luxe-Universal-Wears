# NETICS production onboarding and operating runbook

## Phase 1 — owner discovery

1. Complete every required item in `OWNER-SIGN-OFF.md` on a call with the authorised owner.
2. Confirm the workspace owner email, the existing WhatsApp number and the person responsible for catalogue updates.
3. Demonstrate that the current website forms open WhatsApp; make clear that a draft is not delivered until the customer presses **Send**.
4. Decide whether launch is chat only or chat plus WhatsApp. Phone AI is a separate decision and is not required.
5. Record the source and review date for every policy supplied by the owner.

## Phase 2 — create the NETICS workspace

1. Create the workspace with the authorised owner email, not a developer's personal account.
2. Set business name to `Luxe Universal Wears`, default currency to `NGN`, website to the canonical production URL and timezone to the owner's confirmed operating timezone.
3. Complete the NETICS profile interview using only signed-off facts.
4. Invite the owner and required staff with least-privilege roles.
5. Enable MFA for administrators and verify recovery access.

## Phase 3 — catalogue import

1. Check out the exact production source commit.
2. Run `npm run netics:export`.
3. Review `.netics/onboarding/catalogue-summary.json` and compare the totals with the website.
4. Owner-sample at least 20 products across categories, including cheapest, most expensive, sale and bespoke-adjacent items.
5. Import or upsert by stable SKU. Preserve name, SKU, category, description, NGN price, `in_stock` and `stock_level`.
6. Reconcile create/update/archive counts before publishing.
7. Confirm that archived or removed website products are not left discoverable in NETICS.
8. Schedule a recurring sync. Until a live inventory connection exists, refresh before every campaign and at least daily during normal trading.

The exporter produces at most 100 items per file. It does not authenticate to production or store credentials.

## Phase 4 — knowledge publication

1. Copy only owner-approved material from `KNOWLEDGE-BASE.md` into customer-visible NETICS documents.
2. Publish separate documents for business/contact, delivery, returns, bespoke and corporate terms so each can have its own owner and review date.
3. Keep draft/unapproved documents private.
4. Test retrieval with exact, paraphrased, misspelled and Nigerian-Pidgin questions.
5. Remove conflicts: one subject should have one active authoritative answer.

Every document needs: owner, effective date, last reviewed date, next review date and source.

## Phase 5 — agent setup

Recommended public agent configuration:

- Name: `Luxe Concierge`
- Channel: website chat first
- Languages: English; add Nigerian Pidgin only after owner approval and QA
- Scope: catalogue discovery, product comparison, safe order intake, bespoke/corporate lead intake and human handoff
- Greeting: “Welcome to Luxe Universal Wears. I’m the Luxe Concierge. I can help you find a style, check listed availability, or prepare an order for the team.”
- Fallback: WhatsApp `+234 817 393 8770`
- Allowed production origins: exact HTTPS origins only
  - `https://www.luxeuniversalwears.com`
  - `https://luxeuniversalwears.com`

Do not allow `*`. Add a preview origin only for the specific QA deployment, then remove it after testing.

## Phase 6 — WhatsApp connection

1. In the Luxe workspace, open **Integrations → WhatsApp**.
2. Start connection with the owner-controlled business number.
3. The owner receives the six-digit code in WhatsApp and enters it in NETICS within 15 minutes. Do not put the code in GitHub, documents or chat transcripts.
4. If verification fails, stop after the documented attempt limit and check number format/provider configuration rather than repeatedly guessing.
5. Confirm `connected` status.
6. Test an inbound customer message, a human reply, an AI-to-human escalation and an order notification.
7. Confirm staff notifications, service hours and who owns unanswered threads.
8. Keep the direct `wa.me` website button active as the resilient fallback.

## Phase 7 — website and Vercel activation

In Vercel, add for Production and the approved Preview environment:

```text
NEXT_PUBLIC_NETICS_AGENT_ID=<published Luxe agent ID>
NEXT_PUBLIC_NETICS_API_BASE=https://business.neticsai.com
```

Redeploy and verify that the agent belongs to the Luxe workspace. These are public client identifiers, but the agent's allowed-origin rules remain the security boundary.

Rollback is immediate: remove `NEXT_PUBLIC_NETICS_AGENT_ID` and redeploy. WhatsApp remains available.

## Phase 8 — payments and fulfilment

Do not let the AI request payment until a real provider is connected, sandbox tests pass and webhooks are verified. Test:

- successful payment;
- cancelled/abandoned payment;
- invalid amount or currency;
- duplicate webhook;
- delayed webhook;
- refund and failed refund;
- paid order cannot be changed by an unverified browser redirect.

Define human ownership for pending orders, stock confirmation, packing, dispatch, returns and refunds.

## Phase 9 — launch acceptance tests

Run each scenario on desktop and mobile:

1. Widget loads only on storefront routes and never on `/admin`.
2. WhatsApp and NETICS buttons do not overlap.
3. Missing/blocked NETICS SDK still leaves WhatsApp usable.
4. Ask for a product by exact name, category, misspelling, size, colour and budget.
5. Ask for a nonexistent item; verify no fabrication.
6. Ask for two unavailable variants; verify the assistant does not promise stock.
7. Start an order, change quantity, cancel, resume and request a human.
8. Ask for bespoke, wedding and corporate work with a deadline.
9. Ask about delivery, returns, refunds and payment; verify only approved policies are quoted.
10. Try to submit card details, an OTP, a password and another customer's order number; verify refusal and privacy.
11. Test English and, if enabled, Nigerian Pidgin.
12. Verify contact, bespoke, corporate and newsletter forms open the correct WhatsApp draft and never show a false “received” state.
13. Verify conversation transcript, order, lead and escalation are visible only to authorised Luxe staff.
14. Verify analytics count one conversation/order once and test data is labelled.

## Phase 10 — launch and operations

Launch during staffed hours. For the first week review daily:

- unanswered questions and fallback rate;
- false stock/price claims (target zero);
- handoff completion and WhatsApp response time;
- order funnel: started, confirmed, paid, fulfilled, cancelled;
- catalogue sync failures or stale records;
- customer complaints and privacy incidents;
- widget load errors and mobile layout;
- top knowledge gaps to add only after owner approval.

Weekly, sample at least 20 conversations. Monthly, re-approve policies and staff access.

## Incident playbook

- **Wrong price or stock:** pause commerce replies, correct the Product record, identify affected conversations, contact customers, then re-test.
- **Wrong workspace/agent:** remove the Vercel agent ID immediately, redeploy, investigate allowed origins and tenant ownership.
- **WhatsApp disconnected:** keep widget active, show the phone/email fallback, reconnect with the owner; never request a code from a customer.
- **Payment mismatch:** stop fulfilment, trust provider webhook/ledger only, escalate to finance.
- **Privacy leak:** disable the agent, preserve audit evidence, restrict access and follow the approved incident process.
- **Hallucinated policy:** unpublish the conflicting document, correct the source, regression-test paraphrases before restoring.
- **NETICS outage:** remove the widget ID if necessary; the direct WhatsApp action stays available.
