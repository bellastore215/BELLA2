import type { Locale } from "../i18n/config.ts";
import { formatPrice } from "../lib/money.ts";
import type { PricedCart } from "./pricing.ts";

export interface WhatsAppOrderDetails {
  reference: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
}

const labels: Record<Locale, Record<string, string>> = {
  en: {
    title: "New order",
    reference: "Order reference",
    name: "Name",
    phone: "Phone",
    address: "Delivery address",
    items: "Items",
    subtotal: "Subtotal",
    delivery: "Delivery",
    total: "Total",
    notes: "Notes",
  },
  ar: {
    title: "طلب جديد",
    reference: "رقم الطلب",
    name: "الاسم",
    phone: "الهاتف",
    address: "عنوان التوصيل",
    items: "المنتجات",
    subtotal: "المجموع الفرعي",
    delivery: "التوصيل",
    total: "الإجمالي",
    notes: "ملاحظات",
  },
};

/** Builds the order message from a server-priced cart; never pass client-calculated totals. */
export function buildWhatsAppOrderMessage(
  cart: PricedCart,
  order: WhatsAppOrderDetails,
  locale: Locale,
): string {
  if (!cart.isValid) {
    throw new Error("Cannot build an order message for an invalid cart");
  }
  const t = labels[locale];
  const price = (amount: number) => formatPrice(amount, locale);

  const items = cart.lines.map(
    (line) =>
      `• ${line.product.name[locale]} — ${line.variant.sizeMl}ml × ${line.quantity} = ${price(line.lineTotalAgorot)} (${line.variant.sku})`,
  );

  const lines = [
    `*${t.title}*`,
    `${t.reference}: ${order.reference}`,
    "",
    `${t.name}: ${order.customerName}`,
    `${t.phone}: ${order.phone}`,
    `${t.address}: ${order.address}`,
    "",
    `${t.items}:`,
    ...items,
    "",
    `${t.subtotal}: ${price(cart.subtotalAgorot)}`,
    ...(cart.deliveryFeeAgorot === null ? [] : [`${t.delivery}: ${price(cart.deliveryFeeAgorot)}`]),
    `*${t.total}: ${price(cart.totalAgorot)}*`,
    ...(order.notes ? ["", `${t.notes}: ${order.notes}`] : []),
  ];

  return lines.join("\n");
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
