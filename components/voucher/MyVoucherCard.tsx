"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, Clock, CheckCircle, XCircle, QrCode } from 'lucide-react';
import type { MyVoucher } from '@/lib/api-services';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface MyVoucherCardProps {
  voucher: MyVoucher;
  onShowQR?: (voucher: MyVoucher) => void;
}

const statusConfig = {
  active: {
    label: 'Aktif',
    icon: Ticket,
    className: 'bg-green-500/10 text-green-700 border-green-500/20',
  },
  used: {
    label: 'Terpakai',
    icon: CheckCircle,
    className: 'bg-muted text-muted-foreground border-muted',
  },
  expired: {
    label: 'Kadaluarsa',
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function MyVoucherCard({ voucher, onShowQR }: MyVoucherCardProps) {
  const status = statusConfig[voucher.status];
  const StatusIcon = status.icon;
  const isActive = voucher.status === 'active';

  return (
    <Card 
      className={`overflow-hidden border-border/50 transition-all duration-300 ${
        isActive ? 'hover:border-primary/30 hover:shadow-lg' : 'opacity-75'
      }`}
    >
      <div className="flex">
        {/* Image */}
        <div className="relative w-28 flex-shrink-0">
          <img
            src={voucher.imageUrl}
            alt={voucher.title}
            className={`w-full h-full object-cover ${!isActive ? 'grayscale' : ''}`}
          />
          {!isActive && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <StatusIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                {voucher.title}
              </h3>
              <Badge 
                variant="outline" 
                className={`${status.className} text-xs flex-shrink-0`}
              >
                {status.label}
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Berlaku s/d {format(new Date(voucher.validUntil), 'd MMM yyyy', { locale: id })}
              </p>
              {voucher.status === 'used' && voucher.usedAt && (
                <p className="text-muted-foreground/70">
                  Digunakan: {format(new Date(voucher.usedAt), 'd MMM yyyy, HH:mm', { locale: id })}
                </p>
              )}
            </div>
          </div>

          {isActive && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2 h-8 text-xs gap-1.5 border-primary/50 text-primary hover:bg-primary/10"
              onClick={() => onShowQR?.(voucher)}
            >
              <QrCode className="w-3.5 h-3.5" />
              Tampilkan Kode
            </Button>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
