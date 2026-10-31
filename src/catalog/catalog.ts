import { brands } from "./data/brands.ts";
import { demoProducts } from "./data/products.ts";
import type { Brand, Catalog, Product, ProductVariant } from "./types.ts";

/**
 * Single source of catalog data for storefront and admin. Swap this for a
 * database-backed implementation without changing the query helpers below.
 */
export const catalog: Catalog = {
  brands,
  products: demoProducts,
};

export function findBrand(source: Catalog, idOrSlug: string): Brand | undefined {
  return source.brands.find((brand) => brand.id === idOrSlug || brand.slug === idOrSlug);
}

export function publishedProducts(source: Catalog): Product[] {
  return source.products.filter((product) => product.status === "published" && !product.isDemo);
}

export function findVariantBySku(
  source: Catalog,
  sku: string,
): { product: Product; variant: ProductVariant } | undefined {
  for (const product of source.products) {
    const variant = product.variants.find((v) => v.sku === sku);
    if (variant) return { product, variant };
  }
  return undefined;
}

/** A variant can be sold only with a real price, a counted positive stock, and confirmed provenance. */
export function isPurchasable(product: Product, variant: ProductVariant): boolean {
  return (
    product.status === "published" &&
    !product.isDemo &&
    variant.priceAgorot !== null &&
    variant.stock !== null &&
    variant.stock > 0 &&
    variant.provenance !== "unconfirmed"
  );
}
