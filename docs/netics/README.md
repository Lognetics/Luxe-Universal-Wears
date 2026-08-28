# Luxe Universal Wears — NETICS onboarding pack

This directory is the operational source of truth for onboarding Luxe Universal Wears into NETICS. It deliberately separates facts visible in the repository from facts the business owner has approved for customer-facing use.

## What is implemented in the website

- The NETICS SDK is loaded with Next.js `Script` using `lazyOnload`, which is appropriate for a support widget that must not block the storefront.
- The concierge appears only when `NEXT_PUBLIC_NETICS_AGENT_ID` is configured. A missing or failed widget never removes the direct WhatsApp route.
- The NETICS widget uses the bottom-right corner; the WhatsApp action is stacked above that launcher, so the two do not overlap or cover left-aligned form actions.
- Contact, bespoke, corporate and newsletter forms no longer claim that data was received when no backend accepted it. They prepare the completed request in WhatsApp and require the customer to press **Send**.
- The floating WhatsApp action and footer WhatsApp link use the published business number: `+234 817 393 8770`.
- No secret, admin credential, payment key or WhatsApp verification code is stored in this repository.

## Files in this pack

- `OWNER-SIGN-OFF.md` — every decision or fact that must be confirmed before launch.
- `KNOWLEDGE-BASE.md` — the draft customer-facing knowledge source and safe-answer rules.
- `AGENT-RUNBOOK.md` — build, test, launch, monitoring and incident procedures.
- `onboarding-manifest.json` — machine-readable draft configuration and readiness gates.
- `scripts/export-netics-catalog.mjs` — validates the local catalogue and exports NETICS-ready product batches of at most 100 items.

## Current readiness

| Area | State | Why |
|---|---|---|
| Website widget code | Ready | It is feature-gated by the public NETICS agent ID. |
| Direct WhatsApp handoff | Ready | All customer forms now produce a real WhatsApp draft. |
| Catalogue transform | Ready for owner review | The repository currently contains 316 products, not the 44 stated in the README. |
| Customer knowledge | Draft | Store, policy, delivery and bespoke claims need owner sign-off. |
| NETICS workspace | Not created here | Requires the authorised owner email and production access. |
| WhatsApp connection in NETICS | Not verified | Requires the owner to receive and enter a one-time code. |
| Payments | Safely deferred | Checkout now hands the request to WhatsApp and explicitly collects no payment until a real gateway is connected. |
| Vercel production activation | Waiting for agent ID | Add the two public environment variables after the NETICS agent is published. |

## Catalogue export

Run:

```bash
npm run netics:export
```

The command validates names, SKUs, slugs, NGN prices and stock, then writes four local batches under `.netics/onboarding/`. That directory is ignored by Git because it is an operational export, not a second catalogue source.

The export is a snapshot. It must not be imported until the owner confirms the catalogue, and it must be regenerated whenever `src/data/products.json` changes.

## Non-negotiable launch gate

Do not set `NEXT_PUBLIC_NETICS_AGENT_ID` in Vercel Production until all required boxes in `OWNER-SIGN-OFF.md` are complete, test orders are clearly labelled, and the owner has approved the AI's escalation wording.

## Catalogue sync (added 2026-08-28)

The concierge sells from NETICS's copy of the catalogue, so that copy follows this site in two ways:

- **Push, immediate.** `src/lib/netics.ts` maps a `Product` to what NETICS understands (name, SKU, category, description with fabric, colours and sizes, price, product page link, first image, in stock). `saveProduct` and `deleteProduct` in `src/app/admin/actions.ts` push the single product (`merge`; a deleted product is marked out of stock, never removed), and `publishToLive` pushes the whole published list (`replace`). Requires `NETICS_API_KEY` on the server. A failed push is logged and never blocks the admin panel.
- **Feed, nightly.** `GET /api/netics/products` serves the published catalogue with absolute page and image links. Save `https://luxeuniversalwears.com/api/netics/products` under Products, Catalogue feed in the NETICS console; it is read every night and on "Check now".

Checkout gains **Pay Online** (`NEXT_PUBLIC_NETICS_PAYMENTS=1` or a configured concierge): the server action in `src/app/checkout/actions.ts` records the order in NETICS (`POST /api/public/v1/orders`, custom lines carrying SKU, colour and size) and asks for the hosted checkout link (`POST /orders/{id}/checkout`), then sends the customer to that page. Payment is collected by the provider connected to the Luxe workspace and settled to Luxe's bank; NETICS emails the link and the receipt, and the order sits on the Luxe order board. If the key is missing, the cart is handed to the concierge (`netics-agent.ask()`) instead; WhatsApp stays as the second button.
