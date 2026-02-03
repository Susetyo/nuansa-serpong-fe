"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Hotel, Utensils, Sparkles, Gift, X } from 'lucide-react';

interface VoucherFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedBranch: string | null;
  onBranchChange: (branch: string | null) => void;
  branches: string[];
}

const categories = [
  { id: null, label: 'Semua', icon: Gift },
  { id: 'hotel', label: 'Hotel', icon: Hotel },
  { id: 'fnb', label: 'F&B', icon: Utensils },
  { id: 'spa', label: 'Spa', icon: Sparkles },
  { id: 'other', label: 'Lainnya', icon: Gift },
];

export function VoucherFilter({
  selectedCategory,
  onCategoryChange,
  selectedBranch,
  onBranchChange,
  branches,
}: VoucherFilterProps) {
  return (
    <div className="space-y-3">
      {/* Category Filter */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <Button
                key={cat.id ?? 'all'}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={`flex-shrink-0 gap-1.5 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border/50 hover:border-primary/50'
                }`}
                onClick={() => onCategoryChange(cat.id)}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Branch Filter */}
      {branches.length > 0 && (
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            {branches.map((branch) => {
              const isActive = selectedBranch === branch;
              return (
                <Badge
                  key={branch}
                  variant={isActive ? 'default' : 'outline'}
                  className={`cursor-pointer flex-shrink-0 ${
                    isActive 
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => onBranchChange(isActive ? null : branch)}
                >
                  {branch}
                  {isActive && <X className="w-3 h-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
}
