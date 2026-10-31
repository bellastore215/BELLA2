import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { RetryButton } from "./RetryButton";
import styles from "../status-page.module.css";

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function OfflinePage({ params }: PageProps<"/[lang]/offline">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { offline } = await getDictionary(lang);

  return (
    <section className={`container ${styles.page}`} aria-labelledby="offline-title">
      <h1 id="offline-title">{offline.title}</h1>
      <p>{offline.body}</p>
      <RetryButton label={offline.retry} />
    </section>
  );
}
