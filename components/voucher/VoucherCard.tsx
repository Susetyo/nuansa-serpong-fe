"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, MapPin, Clock } from 'lucide-react';
import type { Voucher } from '@/lib/api-services';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface VoucherCardProps {
  voucher: Voucher;
  onSelect?: (voucher: Voucher) => void;
  userPoints?: number;
}

const categoryLabels: Record<string, string> = {
  hotel: 'Hotel',
  fnb: 'F&B',
  spa: 'Spa',
  other: 'Lainnya',
};

const categoryColors: Record<string, string> = {
  hotel: 'bg-primary/10 text-primary border-primary/20',
  fnb: 'bg-accent/10 text-accent-foreground border-accent/20',
  spa: 'bg-green-500/10 text-green-700 border-green-500/20',
  other: 'bg-muted text-muted-foreground border-muted',
};

export function VoucherCard({ voucher, onSelect, userPoints = 0 }: VoucherCardProps) {
  const canRedeem = userPoints >= voucher.pointsCost && voucher.stock > 0;
  const isLowStock = voucher.stock <= 10;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card 
      className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg cursor-pointer group"
      onClick={() => onSelect?.(voucher)}
    >
      <div className="relative">
        <img
          src={voucher.imageUrl}
          alt={voucher.title}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <Badge 
            variant="outline" 
            className={`${categoryColors[voucher.category]} text-xs font-medium`}
          >
            {categoryLabels[voucher.category]}
          </Badge>
          {isLowStock && (
            <Badge variant="destructive" className="text-xs">
              Sisa {voucher.stock}
            </Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex items-center gap-1.5 text-white/90">
            <Coins className="w-4 h-4 text-accent" />
            <span className="font-bold text-accent">{voucher.pointsCost.toLocaleString('id-ID')}</span>
            <span className="text-xs text-white/70">pts</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-3 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
          {voucher.title}
        </h3>
        
        <p className="text-xs text-muted-foreground line-clamp-2">
          {voucher.description}
        </p>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {voucher.branch && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {voucher.branch}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            s/d {format(new Date(voucher.validUntil), 'd MMM yyyy', { locale: id })}
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="text-xs">
            <span className="text-muted-foreground line-through">
              {formatCurrency(voucher.originalValue)}
            </span>
          </div>
          <Button 
            size="sm" 
            variant={canRedeem ? 'default' : 'secondary'}
            disabled={!canRedeem}
            className="h-7 text-xs px-3"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(voucher);
            }}
          >
            {voucher.stock === 0 ? 'Habis' : canRedeem ? 'Tukar' : 'Poin Kurang'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
