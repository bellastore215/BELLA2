# BELLA2

Bilingual (Arabic RTL / English LTR) perfume storefront PWA. Designer perfumes in 20 ml, 30 ml and 40 ml, priced in Israeli new shekels (ILS), ordered via WhatsApp.

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components, typed routes), React 19, TypeScript (strict)
- CSS Modules + design tokens in CSS custom properties — no UI framework
- Node's built-in test runner for domain logic — no test framework dependency
- Hand-written service worker in `public/sw.js`

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; see Configuration
npm run dev                  # http://localhost:3000 → redirects to /ar or /en
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server (service worker disabled) |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm run typecheck` | Generates route types, then `tsc --noEmit` |
| `npm test` | Unit tests for i18n, money, pricing, WhatsApp, store config |
| `npm run build` / `npm start` | Production build / server (service worker enabled) |
| `npm run check` | All of the above in sequence |

Requires Node.js ≥ 22.18 (TypeScript tests run with native type stripping).

## Project structure

```
src/
  app/
    [lang]/              Root layout per locale (sets lang/dir, fonts, metadata)
      page.tsx           Home shell
      offline/           Offline fallback served by the service worker
      not-found.tsx      Localized 404 (reached via [...rest])
    manifest.ts          Web app manifest
    pwa-icon/[variant]/  Generated PNG app icons (192, 512, maskable, apple)
  proxy.ts               Redirects locale-less URLs using cookie or Accept-Language
  catalog/               Business data: types, brands, (demo) products, queries
  commerce/              Server-side pricing, WhatsApp message, order references
  config/store.ts        Store settings read from environment
  i18n/                  Locale config and typed ar/en dictionaries
  lib/                   Money formatting, shared hooks
  components/            ui/ (primitives), layout/, pwa/
  styles/                tokens.css, globals.css, fonts.ts
public/sw.js             Service worker
```

UI components never hold business data; they read from `catalog/`, `config/` and `i18n/`.

## Data rules

- **Money** is integer agorot (`12_950` = ₪129.50). Format with `formatPrice(amount, locale)`.
- **Each size is a variant** with its own SKU, price, stock and provenance (`decant` / `sealed`).
- **Prices and stock are `null` until supplied by the business.** Unknown stock means *unavailable*.
- `src/catalog/data/products.ts` contains **demo seed records only** (`isDemo: true`, `draft`, no prices). They can never be published or priced into a cart.
- `priceCart()` is the only source of totals. It accepts SKUs and quantities only, re-reads prices from the catalog, and validates quantity, stock, availability and delivery option. Client totals are display-only.
- Scent notes may be added only with a verification `source`.

## Configuration

| Variable | Purpose |
| --- | --- |
| `WHATSAPP_ORDER_NUMBER` | Order recipient in international format. Unset = ordering disabled. |

Delivery options live in `src/config/store.ts` and are intentionally empty until zones and fees are confirmed.

## PWA

- Manifest at `/manifest.webmanifest`, icons at `/pwa-icon/*`.
- Service worker (production only) caches hashed `/_next/static` assets and icons, never caches HTML, and serves `/{lang}/offline` when a navigation fails.
- Non-GET requests and `/api`, `/checkout`, `/account`, `/admin`, `/orders` are never intercepted, so customer and order data are not stored by the service worker.
- Bump `VERSION` in `public/sw.js` when changing caching rules.
