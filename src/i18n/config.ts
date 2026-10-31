export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const localeCookieName = "BELLA_LOCALE";

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

// Western digits keep prices, sizes, and phone numbers unambiguous across both languages.
export const intlLocale: Record<Locale, string> = {
  ar: "ar-u-nu-latn",
  en: "en-IL",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ar" || value === "en";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

/** Picks the best supported locale from an Accept-Language header value. */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
      return { language: tag.toLowerCase().split("-")[0], q: Number.isNaN(q) ? 0 : q };
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { language } of ranked) {
    if (isLocale(language)) return language;
  }
  return defaultLocale;
}
