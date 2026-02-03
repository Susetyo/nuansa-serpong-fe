"use client";

import { Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KTPScanResultDisplayProps {
  extractedData: {
    nik: string;
    name: string;
    dob?: string;
    address?: string;
  };
  inputNik: string;
  isMatched: boolean;
  className?: string;
}

function maskNIK(nik: string): string {
  if (nik.length !== 16) return nik;
  return `${nik.slice(0, 4)}********${nik.slice(-4)}`;
}

export function KTPScanResultDisplay({
  extractedData,
  inputNik,
  isMatched,
  className,
}: KTPScanResultDisplayProps) {
  return (
    <div className={cn('space-y-4 rounded-xl border p-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Hasil Scan KTP</h3>
        {isMatched ? (
          <div className="flex items-center gap-1 text-green-500">
            <Check className="h-4 w-4" />
            <span className="text-xs font-medium">Terverifikasi</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-medium">NIK Tidak Cocok</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* NIK comparison */}
        <div className="rounded-lg bg-muted/30 p-3">
          <div className="mb-2 text-xs text-muted-foreground">NIK</div>
          <div className="flex items-center justify-between">
            <span className={cn(
              'font-mono text-sm font-medium',
              isMatched ? 'text-green-500' : 'text-destructive'
            )}>
              {maskNIK(extractedData.nik)}
            </span>
            {isMatched ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <span className="text-xs text-destructive">
                Input: {maskNIK(inputNik)}
              </span>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="rounded-lg bg-muted/30 p-3">
          <div className="mb-1 text-xs text-muted-foreground">Nama</div>
          <div className="font-medium">{extractedData.name}</div>
        </div>

        {/* DOB (if available) */}
        {extractedData.dob && (
          <div className="rounded-lg bg-muted/30 p-3">
            <div className="mb-1 text-xs text-muted-foreground">Tanggal Lahir</div>
            <div className="font-medium">{extractedData.dob}</div>
          </div>
        )}

        {/* Address (if available) */}
        {extractedData.address && (
          <div className="rounded-lg bg-muted/30 p-3">
            <div className="mb-1 text-xs text-muted-foreground">Alamat</div>
            <div className="text-sm">{extractedData.address}</div>
          </div>
        )}
      </div>

      {!isMatched && (
        <div className="rounded-lg bg-destructive/10 p-3 text-center">
          <p className="text-sm text-destructive">
            NIK yang Anda masukkan tidak sesuai dengan NIK pada KTP.
            <br />
            Silakan periksa kembali atau upload ulang foto KTP.
          </p>
        </div>
      )}
    </div>
  );
}
