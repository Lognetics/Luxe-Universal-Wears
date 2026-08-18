# Luxe Universal Wears — NETICS operator answer sheet

Use this sheet while onboarding the client. Values labelled **Use now** are verified from the production website or repository. Values labelled **Leave unconfirmed** must not become customer-facing promises until the client approves them.

## Create the workspace

- **Full name:** `Luxe Universal Wears Onboarding`
- **Work email:** use a real, unique Lognetics-controlled mailbox or alias, such as `onboarding+luxe@lognetics.com`
- **Business name:** `Luxe Universal Wears`

Do not reuse the same signup email for several customer workspaces. The mailbox must receive NETICS one-use links. Do not use a fake address.

## Step 1 — Tell NETICS how the business works

- **Business name:** `Luxe Universal Wears`
- **In one sentence, what do you do?**

  `Luxe Universal Wears is a Nigerian premium menswear store offering ready-to-wear clothing, footwear and accessories, with bespoke, wedding and corporate enquiries handled by its human team.`

- **Industry:** `Retail & e-commerce`
- **How do you work with customers?** Select:
  - `Sells fixed products`
  - `Provides quoted services`
  - `Takes appointments`
  - `Collects leads`
  - `Handles customer support`

### Sells fixed products

- **Where does your product list live today?**

  `The production website catalogue at https://www.luxeuniversalwears.com; the source repository contains 316 products and is exported to NETICS in four reviewed batches.`

- **How is stock availability checked?**

  `The website contains displayed stock quantities, but they are a repository snapshot. Staff must confirm the requested size, colour and quantity before payment until a live inventory sync is approved.`

- **How do customers receive orders?**

  `Delivery or pickup, after the Luxe team confirms the destination, availability, delivery cost and timing on WhatsApp.`

- **Is payment required before fulfilment?**

  `Payment and fulfilment terms require owner confirmation. Do not request payment or mark an order paid until an approved payment route and verified provider webhook are connected.`

### Provides quoted services

- **Who prepares quotations?**

  `The Luxe human team prepares bespoke, wedding and corporate quotations through the verified WhatsApp handoff.`

- **What is required before a quote?**

  `Customer name and contact, garment or service, occasion date, city, consultation preference, style, colour, fabric preference, estimated quantity for corporate work, and budget range if the customer wishes to share it.`

- **Does the customer approve before work starts?**

  `Leave unconfirmed until the owner supplies the approved quotation and acceptance process.`

- **Deposit and completion rules:**

  `Leave unconfirmed. The AI must escalate instead of inventing a deposit, completion date or final price.`

### Takes appointments

- **What can customers book?**

  `A bespoke, wedding or styling consultation, subject to confirmation by the Luxe team.`

- **Where does availability come from?**

  `The Luxe human team. NETICS may collect a preferred date and time but must not confirm a slot without an approved connected calendar or staff confirmation.`

- **Cancellation policy:**

  `Leave unconfirmed until the owner approves a written policy.`

### Collects leads

- **Information to collect:**

  `Name, phone or WhatsApp number, email when needed, request type, product or service, city, occasion or deadline, preferred consultation method, estimated quantity for corporate orders, and budget range when voluntarily provided.`

### Handles customer support

- **Who handles questions NETICS cannot answer?**

  `The Luxe team on WhatsApp at +234 817 393 8770. The AI should summarise the request so the customer does not repeat it.`

## Step 2 — Add one document

Upload `docs/netics/LUXE-NETICS-KNOWLEDGE.txt`. Wait until its status is **Ready**, then turn on **Publish for customer agent**.

This first document contains only verified contact information and safe operating rules. Delivery prices, returns, refunds, deposits, opening hours and service timelines remain deliberately unconfirmed.

## Step 3 — Add products

Run `npm run netics:export` from the website repository. Import the files under `.netics/onboarding/` in order:

1. `products-001.json` — 100 products
2. `products-002.json` — 100 products
3. `products-003.json` — 100 products
4. `products-004.json` — 16 products

Expected total: **316 products in NGN**. Reconcile the create/update/archive totals before continuing. Do not treat the stored stock numbers as a live inventory feed.

## Step 4 — Test grounded answers

Use these tests:

1. `What kind of products do you sell?`
2. `How much is <an imported product name>?`
3. `Is size 42 definitely available?` — must require confirmation if variant stock is unavailable.
4. `What is your return policy?` — must refuse safely until the policy is approved.
5. `Can I pay now?` — must not create an unofficial payment route.
6. `I need a wedding suit.` — should collect the lead and offer WhatsApp.
7. `I want to speak to a person.` — should provide the verified WhatsApp handoff.

## Step 5 — Create the customer agent

- **Name:** `Luxe Concierge`
- **Title:** `Ask Luxe Concierge`
- **Welcome message:** `Welcome to Luxe Universal Wears. I’m the Luxe Concierge. I can help you find a style, check listed availability, prepare an order request, or connect you with the Luxe team.`
- **Input placeholder:** `Ask about products, sizing or bespoke services…`
- **Primary colour:** `#0098D8`
- **Position:** `Bottom right`
- **Allowed origins:**
  - `https://www.luxeuniversalwears.com`
  - `https://luxeuniversalwears.com`

Never use `*` as an allowed origin.

## Verify the temporary onboarding account in HQ

Clicking the one-use email link signs the account in and marks its email verified in the backend. HQ currently does not display a separate `Email verified` field.

Operational confirmation in HQ:

1. Open **Customer identities** and search for the onboarding email.
2. Confirm the account is active, has the Luxe workspace membership and has a non-empty **Last active** value after the link is used.
3. Open **Workspaces → Luxe Universal Wears** and confirm the generic account is listed as **Owner**.
4. If access is lost, use **Customer identities → Send sign-in link**. HQ sends a new one-use link; it does not expose an impersonation token.

## Handover to the client

1. In **HQ → Workspaces → Luxe Universal Wears**, choose **Add tenant staff**.
2. Enter the client’s real email and select **Owner**. Owner invitations from HQ require a Super administrator.
3. The client accepts the email invitation and signs in.
4. In **Customer identities**, confirm their **Last active** value is no longer `Never`.
5. In the workspace detail, confirm there are now two owners.
6. Demote the Lognetics onboarding account to Administrator for an agreed support period, or remove it after handover.
7. Never demote or remove the temporary owner before the client is an accepted owner. NETICS blocks removal of the last owner.

Record the handover reason in HQ for the audit trail.

