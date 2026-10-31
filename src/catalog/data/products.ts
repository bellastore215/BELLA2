import { sellableSizes, type Product, type ProductVariant } from "../types.ts";

/**
 * DEMO SEED DATA — development only.
 *
 * These records exist so the data model, pricing, and UI can be exercised
 * before the real inventory is supplied. Prices and stock are intentionally
 * `null`, provenance is `unconfirmed`, and every record stays in `draft`, so
 * nothing here can be published or sold. Replace with real data from the
 * business; do not fill in guessed prices, stock levels, or scent notes.
 */
function unpricedVariants(skuPrefix: string): ProductVariant[] {
  return sellableSizes.map((sizeMl) => ({
    sku: `${skuPrefix}-${sizeMl}`,
    sizeMl,
    priceAgorot: null,
    stock: null,
    provenance: "unconfirmed",
  }));
}

export const demoProducts: readonly Product[] = [
  {
    id: "demo-dior-sauvage-edt",
    slug: "dior-sauvage-eau-de-toilette",
    brandId: "dior",
    name: { en: "Sauvage Eau de Toilette", ar: "سوفاج أو دو تواليت" },
    audience: "men",
    scentFamily: null,
    description: null,
    notes: null,
    images: [],
    variants: unpricedVariants("DEMO-DIOR-SAUVAGE-EDT"),
    status: "draft",
    isDemo: true,
  },
  {
    id: "demo-gucci-bloom-edp",
    slug: "gucci-bloom-eau-de-parfum",
    brandId: "gucci",
    name: { en: "Bloom Eau de Parfum", ar: "بلوم أو دو بارفان" },
    audience: "women",
    scentFamily: null,
    description: null,
    notes: null,
    images: [],
    variants: unpricedVariants("DEMO-GUCCI-BLOOM-EDP"),
    status: "draft",
    isDemo: true,
  },
  {
    id: "demo-armani-acqua-di-gio-edt",
    slug: "giorgio-armani-acqua-di-gio-eau-de-toilette",
    brandId: "giorgio-armani",
    name: { en: "Acqua di Giò Eau de Toilette", ar: "أكوا دي جيو أو دو تواليت" },
    audience: "men",
    scentFamily: null,
    description: null,
    notes: null,
    images: [],
    variants: unpricedVariants("DEMO-ARMANI-ADG-EDT"),
    status: "draft",
    isDemo: true,
  },
];
