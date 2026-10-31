import { test } from "node:test";
import assert from "node:assert/strict";
import type { Catalog } from "../catalog/types.ts";
import { brands } from "../catalog/data/brands.ts";
import { generateOrderReference } from "./order-reference.ts";
import { priceCart } from "./pricing.ts";
import { buildWhatsAppOrderMessage, buildWhatsAppUrl } from "./whatsapp.ts";

// Test fixture values only; they are not store prices or stock levels.
const fixtureCatalog: Catalog = {
  brands,
  products: [
    {
      id: "fixture",
      slug: "fixture",
      brandId: "gucci",
      name: { en: "Fixture Scent", ar: "عطر تجريبي" },
      audience: "women",
      scentFamily: null,
      description: null,
      notes: null,
      images: [],
      status: "published",
      isDemo: false,
      variants: [{ sku: "FX-30", sizeMl: 30, priceAgorot: 4_500, stock: 2, provenance: "decant" }],
    },
  ],
};

const order = {
  reference: "BL-TEST1234",
  customerName: "Test Customer",
  phone: "050-000-0000",
  address: "Test street 1",
};

test("buildWhatsAppOrderMessage lists server-priced lines in the chosen language", () => {
  const cart = priceCart([{ sku: "FX-30", quantity: 2 }], fixtureCatalog, {
    maxQuantityPerLine: 10,
    deliveryOptions: [],
  });

  const en = buildWhatsAppOrderMessage(cart, order, "en");
  assert.match(en, /BL-TEST1234/);
  assert.match(en, /Fixture Scent — 30ml × 2/);
  assert.match(en, /Total: ₪\s?90/);
  assert.doesNotMatch(en, /^Delivery:/m);

  const ar = buildWhatsAppOrderMessage(cart, order, "ar");
  assert.match(ar, /عطر تجريبي/);
  assert.match(ar, /الإجمالي/);
});

test("buildWhatsAppOrderMessage refuses invalid carts", () => {
  const cart = priceCart([], fixtureCatalog, { maxQuantityPerLine: 10, deliveryOptions: [] });
  assert.throws(() => buildWhatsAppOrderMessage(cart, order, "en"));
});

test("buildWhatsAppUrl encodes the message", () => {
  const url = new URL(buildWhatsAppUrl("972500000000", "a b\nc"));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/972500000000");
  assert.equal(url.searchParams.get("text"), "a b\nc");
});

test("generateOrderReference produces unambiguous references", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 200; i++) {
    const ref = generateOrderReference();
    assert.match(ref, /^BL-[2-9A-HJKMNP-Z]{8}$/);
    seen.add(ref);
  }
  assert.equal(seen.size, 200);
});
