"use client";

import { useOnlineStatus } from "@/lib/use-online-status";
import styles from "./OfflineBanner.module.css";

export function OfflineBanner({ message }: { message: string }) {
  const isOnline = useOnlineStatus();
  return (
    <div role="status" aria-live="polite" className={styles.region}>
      {isOnline ? null : <p className={`container ${styles.banner}`}>{message}</p>}
    </div>
  );
}
