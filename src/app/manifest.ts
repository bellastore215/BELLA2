import type { MetadataRoute } from "next";
import { defaultLocale, localeDirection } from "@/i18n/config";
import { ar } from "@/i18n/dictionaries/ar";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "BELLA",
    short_name: "BELLA",
    description: ar.meta.description,
    lang: defaultLocale,
    dir: localeDirection[defaultLocale],
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8f4ed",
    theme_color: "#f8f4ed",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
