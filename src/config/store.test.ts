import { test } from "node:test";
import assert from "node:assert/strict";
import { getStoreConfig, parseWhatsAppNumber } from "./store.ts";

test("parseWhatsAppNumber normalises formatted numbers", () => {
  assert.equal(parseWhatsAppNumber("+972 50-000-0000"), "972500000000");
});

test("parseWhatsAppNumber rejects missing or malformed numbers", () => {
  assert.equal(parseWhatsAppNumber(undefined), null);
  assert.equal(parseWhatsAppNumber(""), null);
  assert.equal(parseWhatsAppNumber("0500000000"), null);
  assert.equal(parseWhatsAppNumber("abc"), null);
});

test("getStoreConfig ships with no WhatsApp number or delivery fees configured", () => {
  const config = getStoreConfig({});
  assert.equal(config.whatsappNumber, null);
  assert.deepEqual(config.deliveryOptions, []);
});
