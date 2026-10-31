"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { localeCookieName, otherLocale, type Locale } from "@/i18n/config";

/** Links to the current page in the other language and remembers the choice. */
export function LanguageSwitcher({
  locale,
  label,
  accessibleLabel,
  className,
}: {
  locale: Locale;
  label: string;
  accessibleLabel: string;
  className?: string;
}) {
  const pathname = usePathname();
  const target = otherLocale(locale);
  const rest = pathname.split("/").slice(2).join("/");
  const href = (rest ? `/${target}/${rest}` : `/${target}`) as Route;

  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={accessibleLabel}
      className={className}
      onClick={() => {
        document.cookie = `${localeCookieName}=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
    >
      {label}
    </Link>
  );
}
