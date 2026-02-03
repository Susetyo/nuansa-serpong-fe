"use client";

import { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { MyVoucherCard } from '@/components/voucher/MyVoucherCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Ticket, TicketCheck, TicketX, Copy, Check } from 'lucide-react';
import { mockMyVouchers } from '@/lib/mock-data';
import type { MyVoucher } from '@/lib/api-services';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import QRCode from 'react-qr-code';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

type FilterStatus = 'all' | 'active' | 'used' | 'expired';

const filterOptions: { value: FilterStatus; label: string; icon: typeof Ticket }[] = [
  { value: 'all', label: 'Semua', icon: Ticket },
  { value: 'active', label: 'Aktif', icon: Ticket },
  { value: 'used', label: 'Terpakai', icon: TicketCheck },
  { value: 'expired', label: 'Kadaluarsa', icon: TicketX },
];

export default function MyVouchersPage() {
  const { toast } = useToast();
  
  // Mock data - in real app, fetch from API
  const [vouchers] = useState<MyVoucher[]>(mockMyVouchers);
  const [loading] = useState(false);
  
  // Filter
  const [filter, setFilter] = useState<FilterStatus>('all');
  
  // QR Dialog
  const [selectedVoucher, setSelectedVoucher] = useState<MyVoucher | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredVouchers = vouchers.filter((v) => {
    if (filter === 'all') return true;
    return v.status === filter;
  });

  const counts = {
    all: vouchers.length,
    active: vouchers.filter(v => v.status === 'active').length,
    used: vouchers.filter(v => v.status === 'used').length,
    expired: vouchers.filter(v => v.status === 'expired').length,
  };

  const handleCopyCode = async () => {
    if (!selectedVoucher) return;
    
    try {
      await navigator.clipboard.writeText(selectedVoucher.redeemCode);
      setCopied(true);
      toast({
        title: 'Kode Disalin',
        description: 'Kode redeem berhasil disalin ke clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Gagal Menyalin',
        description: 'Tidak dapat menyalin kode. Coba salin manual.',
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout title="Voucher Saya" showBack={false}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <TicketCheck className="w-5 h-5 text-primary" />
          <h1 className="font-semibold">Voucher Saya</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filterOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = filter === opt.value;
            const count = counts[opt.value];
            
            return (
              <Button
                key={opt.value}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={`flex-shrink-0 gap-1.5 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border/50 hover:border-primary/50'
                }`}
                onClick={() => setFilter(opt.value)}
              >
                <Icon className="w-4 h-4" />
                {opt.label}
                {count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={`ml-1 h-5 px-1.5 text-xs ${
                      isActive ? 'bg-primary-foreground/20 text-primary-foreground' : ''
                    }`}
                  >
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Voucher List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
        ) : filteredVouchers.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? 'Belum ada voucher' 
                : `Tidak ada voucher ${filterOptions.find(f => f.value === filter)?.label.toLowerCase()}`
              }
            </p>
            <p className="text-sm text-muted-foreground/70">
              Tukar poin Anda dengan voucher menarik!
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-20">
            {filteredVouchers.map((voucher) => (
              <MyVoucherCard
                key={voucher.id + voucher.redeemCode}
                voucher={voucher}
                onShowQR={setSelectedVoucher}
              />
            ))}
          </div>
        )}
      </div>

      {/* QR Code Dialog */}
      <Dialog open={!!selectedVoucher} onOpenChange={() => setSelectedVoucher(null)}>
        <DialogContent className="sm:max-w-sm">
          {selectedVoucher && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">Kode Voucher</DialogTitle>
                <DialogDescription className="text-center">
                  Tunjukkan kode ini kepada staff untuk menggunakan voucher
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg mx-auto w-fit">
                  <QRCode
                    value={selectedVoucher.redeemCode}
                    size={180}
                    level="H"
                  />
                </div>
                
                {/* Redeem Code */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground text-center mb-1">Kode Redeem</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="font-mono font-bold text-lg tracking-wider">
                      {selectedVoucher.redeemCode}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleCopyCode}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Voucher Info */}
                <div className="text-center space-y-1">
                  <h3 className="font-semibold text-sm">{selectedVoucher.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    Berlaku sampai {format(new Date(selectedVoucher.validUntil), 'd MMMM yyyy', { locale: id })}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
