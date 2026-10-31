import type { Locale } from "../i18n/config.ts";
import type { Agorot } from "../lib/money.ts";

export type LocalizedText = Record<Locale, string>;

export const sellableSizes = [20, 30, 40] as const;
export type SizeMl = (typeof sellableSizes)[number];

export type Audience = "women" | "men" | "unisex";

export type ScentFamily =
  | "floral"
  | "woody"
  | "amber"
  | "fresh"
  | "citrus"
  | "aromatic"
  | "gourmand"
  | "chypre"
  | "leather";

/**
 * How the customer's bottle is produced. Must be confirmed by the business
 * before a variant is published, because it changes the product description.
 * - `decant`: perfume transferred from an authentic full-size bottle into store packaging.
 * - `sealed`: manufacturer-sealed bottle in this size.
 */
export type Provenance = "decant" | "sealed" | "unconfirmed";

export type PublicationStatus = "draft" | "published";

export interface Brand {
  id: string;
  slug: string;
  name: LocalizedText;
}

export interface ScentNotes {
  top: LocalizedText[];
  heart: LocalizedText[];
  base: LocalizedText[];
  /** Where the notes were verified (e.g. brand product page URL). Required to publish notes. */
  source: string;
}

export interface ProductImage {
  src: string;
  alt: LocalizedText;
  width: number;
  height: number;
}

/** One sellable size of a perfume. Price and stock live here, never on the product. */
export interface ProductVariant {
  sku: string;
  sizeMl: SizeMl;
  /** `null` until the business supplies a real price. */
  priceAgorot: Agorot | null;
  /** `null` until real inventory is counted. Unknown stock is treated as unavailable. */
  stock: number | null;
  provenance: Provenance;
}

export interface Product {
  id: string;
  slug: string;
  brandId: Brand["id"];
  name: LocalizedText;
  audience: Audience;
  scentFamily: ScentFamily | null;
  description: LocalizedText | null;
  notes: ScentNotes | null;
  images: ProductImage[];
  variants: ProductVariant[];
  status: PublicationStatus;
  /** Seed record used for development only; must never be shown as real inventory. */
  isDemo: boolean;
}

export interface Catalog {
  brands: readonly Brand[];
  products: readonly Product[];
}
