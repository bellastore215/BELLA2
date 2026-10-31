import { test } from "node:test";
import assert from "node:assert/strict";
import { defaultLocale, negotiateLocale } from "./config.ts";

test("negotiateLocale falls back to the default locale", () => {
  assert.equal(negotiateLocale(null), defaultLocale);
  assert.equal(negotiateLocale(""), defaultLocale);
  assert.equal(negotiateLocale("fr-FR,de;q=0.8"), defaultLocale);
});

test("negotiateLocale respects quality ordering", () => {
  assert.equal(negotiateLocale("en-US,en;q=0.9,ar;q=0.8"), "en");
  assert.equal(negotiateLocale("he-IL,ar;q=0.9,en;q=0.8"), "ar");
  assert.equal(negotiateLocale("en;q=0.2,ar-IL;q=0.7"), "ar");
});

test("negotiateLocale ignores languages with q=0", () => {
  assert.equal(negotiateLocale("en;q=0,ar;q=0.1"), "ar");
});
