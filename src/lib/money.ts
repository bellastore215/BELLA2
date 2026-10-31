import { intlLocale, type Locale } from "../i18n/config.ts";

export const currency = "ILS" as const;

/**
 * Money is always stored and calculated as integer agorot (1 ILS = 100 agorot)
 * so totals never accumulate floating-point rounding errors.
 */
export type Agorot = number;

export function isValidAgorot(value: unknown): value is Agorot {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

export function formatPrice(amount: Agorot, locale: Locale): string {
  if (!isValidAgorot(amount)) {
    throw new RangeError(`Invalid money amount: ${String(amount)}`);
  }
  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}
