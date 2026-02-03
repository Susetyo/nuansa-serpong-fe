"use client";

import { MainLayout } from '@/components/layout/MainLayout';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/atoms';
import QRCode from 'react-qr-code';
import { Gift, Ticket, History, ChevronRight, Star, Coins } from 'lucide-react';
import Link from 'next/link';

// Mock data for demo
const mockUser = {
  id: '1',
  name: 'John Doe',
  memberNumber: 'IMP-2024-001234',
  tier: 'Gold' as const,
  nik: '3201234567890001',
  phone: '081234567890',
  joinedAt: '2024-01-15',
};

const mockPoints = {
  total: 15750,
  expiryBuckets: [
    { points: 2500, expiryDate: '2024-04-01' },
    { points: 5000, expiryDate: '2024-06-01' },
  ]
};

const tierColors = {
  Silver: 'from-gray-400 to-gray-300',
  Gold: 'from-accent to-gold-muted',
  Platinum: 'from-gray-200 via-white to-gray-300',
};

export default function HomePage() {
  const [user] = useAtom(userAtom);

  const displayUser = user || mockUser;
  const points = mockPoints;

  return (
    <MainLayout showNotification>
      <div className="animate-fade-in-up space-y-6 p-4">
        {/* Member Card */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-card to-charcoal-light p-6 shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selamat datang,</p>
              <h1 className="text-xl font-bold">{displayUser.name}</h1>
              
              {/* Tier Badge */}
              <div className={`mt-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-black ${tierColors[displayUser.tier]}`}>
                <Star className="h-3 w-3" />
                {displayUser.tier} Member
              </div>
              
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {displayUser.memberNumber}
              </p>
            </div>

            {/* QR Code */}
            <div className="rounded-lg bg-white p-2">
              <QRCode 
                value={displayUser.memberNumber} 
                size={72}
                level="M"
              />
            </div>
          </div>
        </div>

        {/* Points Card */}
        <div className="rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/10 to-primary/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                <Coins className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold text-accent">{points.total.toLocaleString()}</p>
              </div>
            </div>
            <Link href="/points" className="text-sm text-accent hover:underline">
              Lihat Detail →
            </Link>
          </div>
          
          {points.expiryBuckets.length > 0 && (
            <div className="mt-3 rounded-lg bg-destructive/10 px-3 py-2">
              <p className="text-xs text-destructive">
                ⚠️ {points.expiryBuckets[0].points.toLocaleString()} points akan kadaluarsa {points.expiryBuckets[0].expiryDate}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h2 className="font-semibold">Menu Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Gift, label: 'Tukar Voucher', path: '/vouchers', color: 'text-accent' },
              { icon: Ticket, label: 'Voucher Saya', path: '/my-vouchers', color: 'text-primary' },
              { icon: History, label: 'Riwayat', path: '/history', color: 'text-muted-foreground' },
              { icon: Coins, label: 'Points', path: '/points', color: 'text-accent' },
            ].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-accent/50 hover:shadow-card"
              >
                <item.icon className={`h-6 w-6 ${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
