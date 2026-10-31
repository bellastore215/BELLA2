import { test } from "node:test";
import assert from "node:assert/strict";
import type { Catalog, Product } from "../catalog/types.ts";
import { catalog as seedCatalog } from "../catalog/catalog.ts";
import { priceCart } from "./pricing.ts";

// Test fixture values only; they are not store prices or stock levels.
const fixtureProduct: Product = {
  id: "fixture",
  slug: "fixture",
  brandId: "dior",
  name: { en: "Fixture", ar: "Fixture" },
  audience: "unisex",
  scentFamily: null,
  description: null,
  notes: null,
  images: [],
  status: "published",
  isDemo: false,
  variants: [
    { sku: "FX-20", sizeMl: 20, priceAgorot: 1_000, stock: 5, provenance: "decant" },
    { sku: "FX-30", sizeMl: 30, priceAgorot: 1_500, stock: 0, provenance: "decant" },
    { sku: "FX-40", sizeMl: 40, priceAgorot: 2_000, stock: 3, provenance: "unconfirmed" },
  ],
};

const fixtureCatalog: Catalog = { brands: seedCatalog.brands, products: [fixtureProduct] };
const config = {
  maxQuantityPerLine: 10,
  deliveryOptions: [
    { id: "std", label: { en: "Standard", ar: "Standard" }, feeAgorot: 300, freeFromAgorot: 5_000 },
  ],
};

test("priceCart uses catalog prices and merges duplicate SKUs", () => {
  const result = priceCart(
    [
      { sku: "FX-20", quantity: 1 },
      { sku: "FX-20", quantity: 2 },
    ],
    fixtureCatalog,
    config,
  );
  assert.equal(result.isValid, true);
  assert.equal(result.lines.length, 1);
  assert.equal(result.lines[0]?.quantity, 3);
  assert.equal(result.subtotalAgorot, 3_000);
  assert.equal(result.deliveryFeeAgorot, null);
  assert.equal(result.totalAgorot, 3_000);
});

test("priceCart ignores any client-supplied price fields", () => {
  const tampered = [{ sku: "FX-20", quantity: 1, priceAgorot: 1 }];
  assert.equal(priceCart(tampered, fixtureCatalog, config).subtotalAgorot, 1_000);
});

test("priceCart rejects invalid quantities", () => {
  for (const quantity of [0, -1, 1.5, Number.NaN, 11]) {
    const result = priceCart([{ sku: "FX-20", quantity }], fixtureCatalog, config);
    assert.equal(result.isValid, false);
    assert.equal(result.issues[0]?.code, "invalid_quantity");
  }
});

test("priceCart enforces stock and provenance", () => {
  const result = priceCart(
    [
      { sku: "FX-20", quantity: 6 },
      { sku: "FX-30", quantity: 1 },
      { sku: "FX-40", quantity: 1 },
      { sku: "NOPE", quantity: 1 },
    ],
    fixtureCatalog,
    config,
  );
  assert.equal(result.isValid, false);
  assert.deepEqual(result.issues, [
    { code: "insufficient_stock", sku: "FX-20", available: 5 },
    { code: "unavailable", sku: "FX-30" },
    { code: "unavailable", sku: "FX-40" },
    { code: "unknown_sku", sku: "NOPE" },
  ]);
});

test("priceCart applies configured delivery and free-delivery threshold", () => {
  const paid = priceCart([{ sku: "FX-20", quantity: 1 }], fixtureCatalog, config, "std");
  assert.equal(paid.deliveryFeeAgorot, 300);
  assert.equal(paid.totalAgorot, 1_300);

  const free = priceCart([{ sku: "FX-20", quantity: 5 }], fixtureCatalog, config, "std");
  assert.equal(free.deliveryFeeAgorot, 0);

  const unknown = priceCart([{ sku: "FX-20", quantity: 1 }], fixtureCatalog, config, "express");
  assert.equal(unknown.isValid, false);
});

test("priceCart flags empty carts", () => {
  const result = priceCart([], fixtureCatalog, config);
  assert.equal(result.isValid, false);
  assert.deepEqual(result.issues, [{ code: "empty_cart" }]);
});

test("demo seed products can never be purchased", () => {
  const result = priceCart([{ sku: "DEMO-DIOR-SAUVAGE-EDT-20", quantity: 1 }], seedCatalog, config);
  assert.equal(result.isValid, false);
  assert.deepEqual(result.issues, [{ code: "unavailable", sku: "DEMO-DIOR-SAUVAGE-EDT-20" }]);
});
