import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "lime" | "dark" | "yellow";

type SharedProps = {
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "sm";
  full?: boolean;
  className?: string;
};

type ButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type LinkButtonProps = SharedProps & {
  href: string;
};

function classNames({ variant, size, full, className }: SharedProps) {
  return [
    styles.button,
    styles[variant ?? "primary"],
    size === "sm" ? styles.sm : "",
    full ? styles.full : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

function isLinkButton(props: ButtonProps | LinkButtonProps): props is LinkButtonProps {
  return typeof props.href === "string";
}

export function Button(props: ButtonProps | LinkButtonProps) {
  const classes = classNames(props);

  if (isLinkButton(props)) {
    return (
      <Link href={props.href} className={classes}>
        {props.children}
      </Link>
    );
  }

  const { children, variant, size, full, className, href: _href, type = "button", ...rest } =
    props;

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
