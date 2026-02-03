"use client";

import { ArrowLeft, Bell } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppBarProps {
  title?: string;
  showBack?: boolean;
  showNotification?: boolean;
  transparent?: boolean;
  className?: string;
}

export function AppBar({ 
  title, 
  showBack = false, 
  showNotification = false,
  transparent = false,
  className 
}: AppBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/home";

  return (
    <header 
      className={cn(
        'fixed left-0 right-0 top-0 z-50 safe-area-top',
        transparent 
          ? 'bg-transparent' 
          : 'border-b border-border bg-card/95 backdrop-blur-lg',
        className
      )}
    >
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {isHome && (
            <div className="flex items-center gap-2">
              {/* Lion dance icon */}
              <div className="lion-icon text-2xl">🦁</div>
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-lg font-bold text-transparent">
                Nuansa Serpong Hotel
              </span>
            </div>
          )}
          
          {title && !isHome && (
            <h1 className="text-lg font-semibold">{title}</h1>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {showNotification && (
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary pulse-gold" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
