import type { LocalizedText } from "../catalog/types.ts";
import type { Agorot } from "../lib/money.ts";

export interface DeliveryOption {
  id: string;
  label: LocalizedText;
  feeAgorot: Agorot;
  /** Subtotal at or above which delivery is free. Omit when there is no threshold. */
  freeFromAgorot?: Agorot;
}

export interface StoreConfig {
  name: string;
  /** E.164 digits without "+", or `null` when not configured. */
  whatsappNumber: string | null;
  /** Empty until the business confirms its delivery zones and fees. */
  deliveryOptions: readonly DeliveryOption[];
  maxQuantityPerLine: number;
}

export function parseWhatsAppNumber(raw: string | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[\s()+-]/g, "");
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null;
}

export function getStoreConfig(env: Record<string, string | undefined> = process.env): StoreConfig {
  return {
    name: "BELLA",
    whatsappNumber: parseWhatsAppNumber(env.WHATSAPP_ORDER_NUMBER),
    deliveryOptions: [],
    maxQuantityPerLine: 10,
  };
}
