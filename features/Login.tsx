"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAtom } from "jotai";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { otpAtom } from "@/store/atoms";
import { Loader2 } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [, setOtp] = useAtom(otpAtom);
  const [nik, setNik] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Set OTP state and navigate
    setOtp({
      purpose: "login",
      nik,
      phone,
      countdown: 60,
      canResend: false,
    });

    setTimeout(() => {
      router.push("/verify-otp");
    }, 500);
  };

  const isValid = nik.length === 16 && phone.length >= 10;

  console.log(process.env.GOOGLE_CLIENT_ID, "@@@@");

  return (
    <MainLayout showBottomNav={false} showBack={false}>
      <div className="flex min-h-[calc(100vh-56px)] flex-col justify-center p-6">
        <div className="animate-fade-in-up mx-auto w-full max-w-sm">
          <button onClick={() => signIn("google", { callbackUrl: "/" })}>
            Sign in with Google
          </button>
          <button onClick={() => signOut({ callbackUrl: "/" })}>
            signOutss
          </button>

          {/* Logo & Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 text-6xl">🦁</div>
            <h1 className="bg-gradient-to-r from-accent to-primary bg-clip-text text-3xl font-bold text-transparent">
              Nuansa Serpong Hotel
            </h1>
            <p className="mt-2 text-muted-foreground">Member Loyalty Program</p>
          </div>
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nik">NIK KTP</Label>
              <Input
                id="nik"
                placeholder="Masukkan 16 digit NIK"
                value={nik}
                onChange={(e) =>
                  setNik(e.target.value.replace(/\D/g, "").slice(0, 16))
                }
                className="mt-1 font-mono"
              />
            </div>

            <div>
              <Label htmlFor="phone">Nomor HP</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 13))
                }
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-accent to-gold-muted text-accent-foreground"
              size="lg"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim OTP...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-accent hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
