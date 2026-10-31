import { notFound } from "next/navigation";
import { catalog } from "@/catalog/catalog";
import { sellableSizes } from "@/catalog/types";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import styles from "./page.module.css";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { home, common } = await getDictionary(lang);

  return (
    <>
      <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
        <p className="eyebrow">{home.eyebrow}</p>
        <h1 id="hero-title" className={styles.heroTitle}>
          {home.title}
        </h1>
        <p className={styles.lead}>{home.lead}</p>
        <p className={styles.status}>{home.status}</p>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="brands-title">
        <header className={styles.sectionHeader}>
          <h2 id="brands-title">{home.brandsTitle}</h2>
          <p>{home.brandsLead}</p>
        </header>
        <ul className={styles.brandList}>
          {catalog.brands.map((brand) => (
            <li key={brand.id} className={styles.brand}>
              <span className={styles.brandName} lang="en" dir="ltr">
                {brand.name.en}
              </span>
              {lang === "ar" ? <span className={styles.brandLocal}>{brand.name.ar}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="sizes-title">
        <header className={styles.sectionHeader}>
          <h2 id="sizes-title">{home.sizesTitle}</h2>
          <p>{home.sizesLead}</p>
        </header>
        <ul className={styles.sizeList}>
          {sellableSizes.map((size) => (
            <li key={size} className={styles.size}>
              <span className={styles.sizeValue}>
                {size}
                <span className={styles.sizeUnit}> {common.millilitres}</span>
              </span>
              <p>{home.sizeDescriptions[size]}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="ordering-title">
        <header className={styles.sectionHeader}>
          <h2 id="ordering-title">{home.orderingTitle}</h2>
        </header>
        <ol className={styles.steps}>
          {home.orderingSteps.map((step) => (
            <li key={step.title} className={styles.step}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
