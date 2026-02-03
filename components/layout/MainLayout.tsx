"use client";

import { ReactNode } from 'react';
import { AppBar } from './AppBar';
import { BottomNav } from './BottomNav';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showBottomNav?: boolean;
  showNotification?: boolean;
  transparentHeader?: boolean;
  className?: string;
  contentClassName?: string;
}

export function MainLayout({
  children,
  title,
  showBack = false,
  showBottomNav = true,
  showNotification = false,
  transparentHeader = false,
  className,
  contentClassName,
}: MainLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background cloud-pattern', className)}>
      <AppBar 
        title={title} 
        showBack={showBack} 
        showNotification={showNotification}
        transparent={transparentHeader}
      />
      
      <main 
        className={cn(
          'pt-14',
          showBottomNav && 'pb-20',
          contentClassName
        )}
      >
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}
