# Luxe Universal Wears

A premium fashion & bespoke tailoring e-commerce platform for the Nigerian luxury menswear house **Luxe Universal Wears**. Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **TypeScript**, and **Supabase**.

The storefront is built around 44 real product photographs (suits, tuxedos, blazers, jackets, footwear & more) that were auto-categorised into a structured catalogue.

---

## Getting started

```bash
cd luxe-app
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (97 routes)
```

> The site runs **fully without a backend** — the catalogue is served from local data and auth/cart/wishlist work in the browser (demo mode). Supabase adds real accounts, persistence, and lead capture.

---

## What's included

**Storefront**
- Homepage — rotating hero, featured categories, new arrivals, luxury collections, best sellers, bespoke teaser, "why us", testimonials, gallery, newsletter
- Shop — instant client-side filtering (category, size, colour, brand, price, on-sale), sort, active-filter chips, mobile filter drawer
- Category pages (`/category/[slug]`) with graceful "coming soon" for empty categories
- Product detail — image gallery w/ zoom, size/colour/qty selectors, add-to-cart, buy-now, wishlist, accordion (description/fabric/care/delivery/returns), frequently-bought-together, related rail
- Collections (`/collections/corporate|casual|luxury`) and an Accessories hub
- Cart + slide-out mini-cart, coupon (`LUXE10`), free-shipping progress
- Wishlist
- Checkout — shipping, delivery options, payment selector (Paystack / Flutterwave / Bank Transfer / Stripe / PayPal), order confirmation

**Accounts** (`/login`, `/register`, `/account`)
- Auth via Supabase (demo mode when not configured)
- Dashboard: overview, profile, orders, wishlist, addresses, measurements, tailoring requests, returns, rewards

**Brand & services**
- Bespoke tailoring (with booking form), Lookbook, Style Guide, About
- Fashion Journal (`/blog` + articles), Contact (form + map), Wedding & Groom, Membership Club, Corporate & Bulk Orders, Outfit Builder

---

## Project structure

```
luxe-app/
├── src/
│   ├── app/                 # all routes (App Router)
│   ├── components/
│   │   ├── layout/          # Header (mega menu), Footer, Search, Announcement
│   │   ├── product/         # ProductCard, ProductGrid
│   │   ├── home/            # Hero, ProductRail, Testimonials
│   │   ├── cart/            # MiniCart drawer
│   │   ├── providers/       # StoreProvider (cart/wishlist), AuthProvider
│   │   └── ui/              # Button, Container, Toast, SocialIcons
│   ├── lib/                 # catalog, types, format, nav, supabase client
│   └── data/                # products.json, categories.json (generated)
├── public/products/         # 44 product images (generated)
├── supabase/
│   ├── migrations/0001_init.sql   # full schema + RLS + auth trigger
│   └── seed.sql                   # catalogue seed (generated)
└── scripts/                 # build-catalog.mjs, build-seed.mjs
```

`node scripts/build-seed.mjs` regenerates `supabase/seed.sql` from the data JSON.

---

## Connecting Supabase (final step)

1. Create a Supabase project named `luxe-universal-wears`.
2. Run `supabase/migrations/0001_init.sql` then `supabase/seed.sql` in the SQL editor.
3. Copy `.env.local.example` → `.env.local` and fill:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. Restart `npm run dev`. Auth, profiles, and persistence light up automatically.

The schema ships with **Row Level Security** enabled on every table, owner-scoped policies for user data, public read for the catalogue, insert-only lead capture, and a trigger that auto-creates a profile on sign-up.

---

## Design system

Tailwind v4 tokens (in `globals.css`): an ivory/cream/ink palette with a gold accent, **Cormorant Garamond** display serif + **Jost** sans. Sharp-edged, editorial, generous whitespace — styled after Mr Porter / Zegna / SuitSupply.

## Payments & i18n (next steps)
Payment selectors are wired as UI; integrate Paystack/Flutterwave/Stripe SDKs at checkout. Pricing is in NGN (`formatNaira`). Multi-currency/language, AR try-on, and the AI stylist from the brief are scoped for future phases.
