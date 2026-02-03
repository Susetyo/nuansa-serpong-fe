"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gift, Ticket, User } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Gift, label: 'Vouchers', path: '/vouchers' },
  { icon: Ticket, label: 'My Vouchers', path: '/my-vouchers' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200',
                isActive 
                  ? 'text-accent' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon 
                className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  isActive && 'scale-110'
                )} 
              />
              <span className={cn(
                'text-xs font-medium',
                isActive && 'text-accent'
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
