"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { MainLayout } from '@/components/layout/MainLayout';
import { KTPUpload } from '@/components/auth/KTPUpload';
import { KTPScanResultDisplay } from '@/components/auth/KTPScanResult';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerAtom, otpAtom } from '@/store/atoms';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [register, setRegister] = useAtom(registerAtom);
  const [, setOtp] = useAtom(otpAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (field: 'name' | 'phone' | 'nik', value: string) => {
    setRegister(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value }
    }));
  };

  const handleKTPCapture = async (file: File, previewUrl: string) => {
    setRegister(prev => ({ ...prev, ktpImage: previewUrl, ktpScanStatus: 'uploading' }));
    
    // Simulate OCR scan (replace with real API call)
    setTimeout(() => {
      setRegister(prev => ({ ...prev, ktpScanStatus: 'scanning' }));
      
      setTimeout(() => {
        // Mock scan result
        const mockResult = {
          extracted: {
            nik: register.formData.nik || '3201234567890001',
            name: register.formData.name || 'John Doe',
            dob: '01-01-1990',
            address: 'Jakarta, Indonesia'
          },
          imageId: 'mock-id-123'
        };
        
        const isMatch = mockResult.extracted.nik === register.formData.nik;
        setRegister(prev => ({
          ...prev,
          ktpScanResult: mockResult,
          ktpScanStatus: 'success',
          isNikMatched: isMatch
        }));
      }, 1500);
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!register.isNikMatched) return;
    
    setIsSubmitting(true);
    // Navigate to OTP verification
    setOtp({
      purpose: 'register',
      nik: register.formData.nik,
      phone: register.formData.phone,
      countdown: 60,
      canResend: false
    });
    router.push('/verify-otp');
  };

  const isFormValid = register.formData.name && 
    register.formData.phone.length >= 10 && 
    register.formData.nik.length === 16;

  return (
    <MainLayout showBottomNav={false} showBack title="Daftar Member">
      <div className="animate-fade-in-up p-4">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 text-4xl">🦁</div>
          <h1 className="text-2xl font-bold">Daftar Membership</h1>
          <p className="text-sm text-muted-foreground">Nuansa Serpong Loyalty Program</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              placeholder="Masukkan nama sesuai KTP"
              value={register.formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Nomor HP</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={register.formData.phone}
              onChange={(e) => handleFormChange('phone', e.target.value.replace(/\D/g, '').slice(0, 13))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="nik">NIK KTP (16 digit)</Label>
            <Input
              id="nik"
              placeholder="3201234567890001"
              value={register.formData.nik}
              onChange={(e) => handleFormChange('nik', e.target.value.replace(/\D/g, '').slice(0, 16))}
              className="mt-1 font-mono"
            />
          </div>

          {/* KTP Upload */}
          <div className="pt-2">
            <Label>Foto KTP</Label>
            <KTPUpload
              onImageCapture={handleKTPCapture}
              scanStatus={register.ktpScanStatus}
              scanError={register.ktpScanError}
              className="mt-2"
            />
          </div>

          {/* Scan Result */}
          {register.ktpScanResult && register.ktpScanStatus === 'success' && (
            <KTPScanResultDisplay
              extractedData={register.ktpScanResult.extracted}
              inputNik={register.formData.nik}
              isMatched={register.isNikMatched ?? false}
            />
          )}

          {/* Submit Button */}
          <Button
            className="w-full bg-gradient-to-r from-accent to-gold-muted text-accent-foreground"
            size="lg"
            disabled={!isFormValid || !register.isNikMatched || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Daftar Sekarang'
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-medium text-accent hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
