import Link from "next/link";
import { Suspense } from "react";
import { otherLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./SiteHeader.module.css";

export function SiteHeader({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const { common } = dictionary;
  return (
    <header className={styles.header}>
      <nav className={`container ${styles.inner}`} aria-label={common.mainNavigation}>
        <Link href={`/${locale}`} className={styles.wordmark} lang="en" dir="ltr">
          BELLA
        </Link>
        <Suspense
          fallback={
            <Link href={`/${otherLocale(locale)}`} hrefLang={otherLocale(locale)} className={styles.language}>
              {common.switchLanguage}
            </Link>
          }
        >
          <LanguageSwitcher
            locale={locale}
            label={common.switchLanguage}
            accessibleLabel={common.switchLanguageLabel}
            className={styles.language}
          />
        </Suspense>
      </nav>
    </header>
  );
}
