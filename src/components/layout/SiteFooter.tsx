import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./SiteFooter.module.css";

export function SiteFooter({ dictionary }: { dictionary: Dictionary }) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.wordmark} lang="en" dir="ltr">
          BELLA
        </p>
        <p className={styles.tagline}>{dictionary.common.brandTagline}</p>
        <p className={styles.note}>{dictionary.home.currencyNote}</p>
      </div>
    </footer>
  );
}
