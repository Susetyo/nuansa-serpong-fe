"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { VoucherCard, VoucherFilter } from '@/components/voucher';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Coins, Ticket } from 'lucide-react';
import { mockVouchers, mockPoints } from '@/lib/mock-data';
import type { Voucher } from '@/lib/api-services';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function VouchersPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Mock data - in real app, fetch from API
  const [vouchers] = useState<Voucher[]>(mockVouchers);
  const [userPoints] = useState(mockPoints.total);
  const [loading] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  
  // Redeem dialog
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Get unique branches
  const branches = useMemo(() => {
    const branchSet = new Set(vouchers.map(v => v.branch).filter(Boolean) as string[]);
    return Array.from(branchSet).sort();
  }, [vouchers]);

  // Filtered vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          v.title.toLowerCase().includes(searchLower) ||
          v.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      // Category filter
      if (selectedCategory && v.category !== selectedCategory) return false;
      
      // Branch filter
      if (selectedBranch && v.branch !== selectedBranch) return false;
      
      return true;
    });
  }, [vouchers, search, selectedCategory, selectedBranch]);

  const handleSelectVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
  };

  const handleRedeem = async () => {
    if (!selectedVoucher) return;
    
    if (userPoints < selectedVoucher.pointsCost) {
      toast({
        title: 'Poin Tidak Cukup',
        description: `Anda membutuhkan ${selectedVoucher.pointsCost.toLocaleString('id-ID')} poin untuk menukar voucher ini.`,
        variant: 'destructive',
      });
      return;
    }
    
    setIsRedeeming(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Voucher Berhasil Ditukar! 🎉',
      description: 'Lihat voucher Anda di menu "Voucher Saya".',
    });
    
    setIsRedeeming(false);
    setSelectedVoucher(null);
    router.push('/my-vouchers');
  };

  return (
    <MainLayout title="Voucher" showBack={false}>
      <div className="p-4 space-y-4">
        {/* Header with Points */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            <h1 className="font-semibold">Tukar Voucher</h1>
          </div>
          <Badge variant="outline" className="gap-1.5 border-accent/50 bg-accent/10">
            <Coins className="w-3.5 h-3.5 text-accent" />
            <span className="font-bold text-accent">{userPoints.toLocaleString('id-ID')}</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari voucher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border/50"
          />
        </div>

        {/* Filters */}
        <VoucherFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
          branches={branches}
        />

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Menampilkan {filteredVouchers.length} voucher
        </div>

        {/* Voucher Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : filteredVouchers.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">Tidak ada voucher ditemukan</p>
            <p className="text-sm text-muted-foreground/70">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
            {filteredVouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                userPoints={userPoints}
                onSelect={handleSelectVoucher}
              />
            ))}
          </div>
        )}
      </div>

      {/* Redeem Dialog */}
      <Dialog open={!!selectedVoucher} onOpenChange={() => setSelectedVoucher(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedVoucher && (
            <>
              <DialogHeader>
                <DialogTitle className="text-left">Tukar Voucher</DialogTitle>
                <DialogDescription className="text-left">
                  Konfirmasi penukaran voucher dengan poin Anda
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <img
                  src={selectedVoucher.imageUrl}
                  alt={selectedVoucher.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
                
                <div>
                  <h3 className="font-semibold">{selectedVoucher.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedVoucher.description}
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Poin Anda</span>
                    <span className="font-medium">{userPoints.toLocaleString('id-ID')} pts</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Poin Dibutuhkan</span>
                    <span className="font-medium text-primary">
                      -{selectedVoucher.pointsCost.toLocaleString('id-ID')} pts
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-medium">Sisa Poin</span>
                    <span className="font-bold text-accent">
                      {(userPoints - selectedVoucher.pointsCost).toLocaleString('id-ID')} pts
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedVoucher(null)}
                  disabled={isRedeeming}
                  className="w-full sm:w-auto"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleRedeem}
                  disabled={isRedeeming || userPoints < selectedVoucher.pointsCost}
                  className="w-full sm:w-auto"
                >
                  {isRedeeming ? 'Memproses...' : 'Konfirmasi Tukar'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
