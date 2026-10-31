import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { isLocale, localeDirection, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#f8f4ed",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = await getDictionary(lang);

  return {
    title: { default: meta.title, template: `%s — BELLA` },
    description: meta.description,
    applicationName: "BELLA",
    alternates: {
      canonical: `/${lang}`,
      languages: { ar: "/ar", en: "/en", "x-default": "/" },
    },
    appleWebApp: { capable: true, title: "BELLA", statusBarStyle: "default" },
    icons: {
      icon: [{ url: "/pwa-icon/192", sizes: "192x192", type: "image/png" }],
      apple: [{ url: "/pwa-icon/apple", sizes: "180x180", type: "image/png" }],
    },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} dir={localeDirection[lang]} className={fontVariables}>
      <body>
        <a href="#main" className="skip-link">
          {dictionary.common.skipToContent}
        </a>
        <OfflineBanner message={dictionary.common.offlineBanner} />
        <SiteHeader locale={lang} dictionary={dictionary} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter dictionary={dictionary} />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
