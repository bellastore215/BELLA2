import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPrice, isValidAgorot } from "./money.ts";

test("isValidAgorot only accepts non-negative safe integers", () => {
  assert.equal(isValidAgorot(0), true);
  assert.equal(isValidAgorot(12_950), true);
  assert.equal(isValidAgorot(-1), false);
  assert.equal(isValidAgorot(10.5), false);
  assert.equal(isValidAgorot("100"), false);
  assert.equal(isValidAgorot(Number.NaN), false);
});

test("formatPrice renders ILS in both locales with western digits", () => {
  const en = formatPrice(12_950, "en");
  const ar = formatPrice(12_950, "ar");
  assert.match(en, /129\.50/);
  assert.match(en, /₪/);
  assert.match(ar, /129[.,٫]50/);
  assert.doesNotMatch(ar, /[٠-٩]/);
});

test("formatPrice omits decimals for whole shekels", () => {
  assert.match(formatPrice(10_000, "en"), /^[^\d]*100[^\d.]*$/);
});

test("formatPrice rejects invalid amounts", () => {
  assert.throws(() => formatPrice(1.5, "en"), RangeError);
});
