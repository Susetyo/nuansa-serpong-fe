"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";

import { OTPInput } from "@/components/auth/OTPInput";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { otpAtom } from "@/store/atoms";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otpState] = useAtom(otpAtom);
  const [otp, setOtp] = useState("");

  return (
    <MainLayout title="Verifikasi OTP" showBack showBottomNav={false}>
      <div className="mx-auto max-w-md space-y-6 p-4">
        <p className="text-sm text-muted-foreground">
          Masukkan kode OTP yang dikirim ke {otpState.phone || "nomor HP Anda"}.
        </p>
        <OTPInput value={otp} onChange={setOtp} />
        <Button className="w-full" disabled={otp.length !== 6} onClick={() => router.push("/home")}>
          Verifikasi
        </Button>
      </div>
    </MainLayout>
  );
}
