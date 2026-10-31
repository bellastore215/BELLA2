import { notFound } from "next/navigation";

// Routes unmatched URLs to the localized `[lang]/not-found.tsx` instead of the framework default.
export default function CatchAllPage() {
  notFound();
}
