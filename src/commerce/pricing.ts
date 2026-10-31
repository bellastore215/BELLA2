import { findVariantBySku, isPurchasable } from "../catalog/catalog.ts";
import type { Catalog, Product, ProductVariant } from "../catalog/types.ts";
import type { StoreConfig } from "../config/store.ts";
import type { Agorot } from "../lib/money.ts";

/** What the client is allowed to send: identifiers and quantities only, never prices. */
export interface CartLineInput {
  sku: string;
  quantity: number;
}

export type CartIssue =
  | { code: "invalid_quantity"; sku: string }
  | { code: "unknown_sku"; sku: string }
  | { code: "unavailable"; sku: string }
  | { code: "insufficient_stock"; sku: string; available: number }
  | { code: "unknown_delivery_option"; deliveryOptionId: string }
  | { code: "empty_cart" };

export interface PricedLine {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPriceAgorot: Agorot;
  lineTotalAgorot: Agorot;
}

export interface PricedCart {
  lines: PricedLine[];
  subtotalAgorot: Agorot;
  /** `null` when no delivery option was requested or none is configured. */
  deliveryFeeAgorot: Agorot | null;
  totalAgorot: Agorot;
  issues: CartIssue[];
  /** True only when there are lines and no issues, i.e. the order may be submitted. */
  isValid: boolean;
}

/**
 * Prices a cart from trusted catalog data. Run this on the server for every
 * cart view and before accepting an order; client-held totals are display-only.
 */
export function priceCart(
  input: readonly CartLineInput[],
  source: Catalog,
  config: Pick<StoreConfig, "deliveryOptions" | "maxQuantityPerLine">,
  deliveryOptionId?: string,
): PricedCart {
  const issues: CartIssue[] = [];
  const quantities = new Map<string, number>();

  for (const { sku, quantity } of input) {
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      issues.push({ code: "invalid_quantity", sku });
      continue;
    }
    quantities.set(sku, (quantities.get(sku) ?? 0) + quantity);
  }

  const lines: PricedLine[] = [];
  for (const [sku, quantity] of quantities) {
    if (quantity > config.maxQuantityPerLine) {
      issues.push({ code: "invalid_quantity", sku });
      continue;
    }
    const match = findVariantBySku(source, sku);
    if (!match) {
      issues.push({ code: "unknown_sku", sku });
      continue;
    }
    const { product, variant } = match;
    if (!isPurchasable(product, variant) || variant.priceAgorot === null || variant.stock === null) {
      issues.push({ code: "unavailable", sku });
      continue;
    }
    if (quantity > variant.stock) {
      issues.push({ code: "insufficient_stock", sku, available: variant.stock });
      continue;
    }
    lines.push({
      product,
      variant,
      quantity,
      unitPriceAgorot: variant.priceAgorot,
      lineTotalAgorot: variant.priceAgorot * quantity,
    });
  }

  if (input.length === 0) issues.push({ code: "empty_cart" });

  const subtotalAgorot = lines.reduce((sum, line) => sum + line.lineTotalAgorot, 0);

  let deliveryFeeAgorot: Agorot | null = null;
  if (deliveryOptionId !== undefined) {
    const option = config.deliveryOptions.find((o) => o.id === deliveryOptionId);
    if (!option) {
      issues.push({ code: "unknown_delivery_option", deliveryOptionId });
    } else {
      const isFree = option.freeFromAgorot !== undefined && subtotalAgorot >= option.freeFromAgorot;
      deliveryFeeAgorot = isFree ? 0 : option.feeAgorot;
    }
  }

  return {
    lines,
    subtotalAgorot,
    deliveryFeeAgorot,
    totalAgorot: subtotalAgorot + (deliveryFeeAgorot ?? 0),
    issues,
    isValid: lines.length > 0 && issues.length === 0,
  };
}
