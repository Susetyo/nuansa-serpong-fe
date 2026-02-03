"use client";

import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, AlertCircle, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import imageCompression from 'browser-image-compression';

interface KTPUploadProps {
  onImageCapture: (file: File, previewUrl: string) => void;
  onScanResult?: (result: KTPScanResult) => void;
  isScanning?: boolean;
  scanStatus?: 'idle' | 'uploading' | 'scanning' | 'success' | 'error';
  scanError?: string | null;
  className?: string;
}

export interface KTPScanResult {
  nik: string;
  name: string;
  dob?: string;
  address?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function KTPUpload({
  onImageCapture,
  isScanning = false,
  scanStatus = 'idle',
  scanError,
  className,
}: KTPUploadProps) {
  const isBusy = isScanning || scanStatus === 'uploading' || scanStatus === 'scanning';
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async (file: File) => {
    setError(null);

    // Validate file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      // Try to compress
      try {
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        file = await imageCompression(file, options);
      } catch {
        setError('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setPreview(previewUrl);
      onImageCapture(file, previewUrl);
    };
    reader.readAsDataURL(file);
  }, [onImageCapture]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const getScanStatusUI = () => {
    switch (scanStatus) {
      case 'uploading':
        return (
          <div className="flex items-center gap-2 text-accent">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Mengunggah foto...</span>
          </div>
        );
      case 'scanning':
        return (
          <div className="flex items-center gap-2 text-accent">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Memindai KTP...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center gap-2 text-green-500">
            <Check className="h-4 w-4" />
            <span className="text-sm">KTP berhasil dipindai</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{scanError || 'Gagal memindai KTP'}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Preview or Upload Area */}
      {preview ? (
        <div className="relative overflow-hidden rounded-xl border-2 border-accent/50">
          <img
            src={preview}
            alt="KTP Preview"
            className="w-full object-contain"
          />
          
          {/* Overlay for scanning state */}
          {(scanStatus === 'uploading' || scanStatus === 'scanning') && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-center">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-accent" />
                <p className="mt-2 text-sm text-white">
                  {scanStatus === 'uploading' ? 'Mengunggah...' : 'Memindai KTP...'}
                </p>
              </div>
            </div>
          )}

          {/* Remove button */}
          {scanStatus !== 'uploading' && scanStatus !== 'scanning' && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <Camera className="h-8 w-8 text-accent" />
          </div>
          <h3 className="mb-2 font-semibold">Upload Foto KTP</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Pastikan foto jelas, tidak blur, dan seluruh KTP terlihat
          </p>
          
          <div className="flex justify-center gap-3">
            {/* Camera capture (mobile) */}
            <Button
              variant="outline"
              className="gap-2"
              disabled={isBusy}
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
              Kamera
            </Button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* File upload */}
            <Button
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isBusy}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Pilih File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Scan status */}
      {preview && getScanStatusUI()}

      {/* Tips */}
      {!preview && (
        <div className="rounded-lg bg-muted/30 p-4">
          <h4 className="mb-2 text-sm font-semibold text-accent">💡 Tips Foto KTP</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Pastikan pencahayaan cukup terang</li>
            <li>• KTP tidak terpotong dan terlihat jelas</li>
            <li>• Hindari pantulan cahaya atau bayangan</li>
            <li>• Foto tidak blur atau buram</li>
          </ul>
        </div>
      )}
    </div>
  );
}
