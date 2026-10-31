import type { Route } from "next";
import Link from "next/link";
import type { ComponentProps } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "quiet";

function classes(variant: Variant, className?: string) {
  return [styles.button, styles[variant], className].filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button type={type} className={classes(variant, className)} {...props} />;
}

export function ButtonLink<T extends string>({
  variant = "primary",
  className,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: Route<T>; variant?: Variant }) {
  return <Link className={classes(variant, className)} {...props} />;
}
