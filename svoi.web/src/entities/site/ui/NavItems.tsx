"use client";

import Link from "next/link";
import type { NavLink } from "../model/schema";

export function NavItems({
  links,
  className,
  linkClassName,
  onAction,
  onNavigate,
}: {
  links: NavLink[];
  className?: string;
  linkClassName?: string;
  onAction?: (action: string) => void;
  onNavigate?: () => void;
}) {
  return (
    <nav className={className}>
      {links.map((link) => {
        if (link.target.type === "broken") {
          return null;
        }

        if (link.target.type === "action") {
          return (
            <button
              key={link.id}
              type="button"
              className={linkClassName}
              onClick={() => {
                if (link.target.type === "action" && link.target.action) {
                  onAction?.(link.target.action);
                }
                onNavigate?.();
              }}
            >
              {link.label}
            </button>
          );
        }

        const href = link.target.type === "page" ? link.target.path : link.target.href;
        if (!href) {
          return null;
        }

        return (
          <Link key={link.id} href={href} onClick={onNavigate}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
