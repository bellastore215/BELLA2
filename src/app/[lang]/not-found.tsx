import { lang } from "next/root-params";
import { ButtonLink } from "@/components/ui/Button";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import styles from "./status-page.module.css";

export default async function NotFound() {
  const param = await lang();
  const locale = isLocale(param) ? param : defaultLocale;
  const { notFound } = await getDictionary(locale);

  return (
    <section className={`container ${styles.page}`} aria-labelledby="not-found-title">
      <h1 id="not-found-title">{notFound.title}</h1>
      <p>{notFound.body}</p>
      <ButtonLink href={`/${locale}`} variant="secondary">
        {notFound.home}
      </ButtonLink>
    </section>
  );
}
