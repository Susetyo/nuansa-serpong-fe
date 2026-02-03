"use client";

import { forwardRef } from "react";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">, LinkProps {
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, exact = false, href, ...props }, ref) => {
    const pathname = usePathname();
    const targetPath = typeof href === "string" ? href : href.pathname ?? "";
    const isActive = exact ? pathname === targetPath : pathname.startsWith(targetPath);

    return <Link ref={ref} href={href} className={cn(className, isActive && activeClassName)} {...props} />;
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
