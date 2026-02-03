"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
  className,
}: OTPInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, length);
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && value.length === 0) {
      return;
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    // Auto focus on mount
    inputRef.current?.focus();
  }, []);

  return (
    <div className={cn('relative', className)}>
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        className="absolute inset-0 h-full w-full cursor-default opacity-0"
      />

      {/* Visual boxes */}
      <div
        className="flex cursor-text justify-center gap-2"
        onClick={handleContainerClick}
      >
        {Array.from({ length }).map((_, index) => {
          const char = value[index] || '';
          const isCurrentIndex = value.length === index;
          const isFilled = index < value.length;

          return (
            <div
              key={index}
              className={cn(
                'flex h-14 w-12 items-center justify-center rounded-lg border-2 text-2xl font-bold transition-all duration-200',
                focused && isCurrentIndex && 'border-accent ring-2 ring-accent/30',
                isFilled && 'border-accent bg-accent/10',
                !isFilled && !focused && 'border-muted-foreground/30',
                error && 'border-destructive bg-destructive/10',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {char && (
                <span className={cn(
                  'animate-scale-in text-foreground',
                  error && 'text-destructive'
                )}>
                  {char}
                </span>
              )}
              {focused && isCurrentIndex && !char && (
                <span className="h-6 w-0.5 animate-pulse bg-accent" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
