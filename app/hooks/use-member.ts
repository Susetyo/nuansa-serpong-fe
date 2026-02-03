"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";

import { authService, memberService, voucherService } from "@/lib/api-services";
import type {
  MyVoucher,
  OTPRequest,
  OTPVerifyRequest,
  PointsData,
  RegisterRequest,
  Transaction,
  Voucher,
} from "@/lib/api-services";
import { authAtom, userAtom } from "@/store/atoms";
import { useToast } from "@/hooks/use-toast";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Terjadi kesalahan";
}

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);
  const [, setUser] = useAtom(userAtom);
  const router = useRouter();
  const { toast } = useToast();

  const login = useCallback(async (data: OTPVerifyRequest) => {
    try {
      const response = await authService.verifyOTP(data);
      localStorage.setItem("auth_token", response.token);
      setAuth({ token: response.token, isAuthenticated: true });
      setUser(response.user);
      router.push("/home");
      toast({
        title: "Login Berhasil",
        description: `Selamat datang kembali, ${response.user.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login Gagal",
        description: getErrorMessage(error),
        variant: "destructive",
      });
      throw error;
    }
  }, [router, setAuth, setUser, toast]);

  const logout = useCallback(() => {
    authService.logout();
    setAuth({ token: null, isAuthenticated: false });
    setUser(null);
    router.push("/login");
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari akun.",
    });
  }, [router, setAuth, setUser, toast]);

  const requestOTP = useCallback(async (data: OTPRequest) => {
    try {
      await authService.requestOTP(data);
      toast({
        title: "OTP Terkirim",
        description: "Kode OTP telah dikirim ke nomor HP Anda.",
      });
    } catch (error) {
      toast({
        title: "Gagal Mengirim OTP",
        description: getErrorMessage(error),
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      await authService.register(data);
      toast({
        title: "Registrasi Berhasil",
        description: "Silakan verifikasi dengan kode OTP.",
      });
    } catch (error) {
      toast({
        title: "Registrasi Gagal",
        description: getErrorMessage(error),
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  return {
    auth,
    login,
    logout,
    requestOTP,
    register,
    isAuthenticated: auth.isAuthenticated,
  };
}

export function useMember() {
  const [user, setUser] = useAtom(userAtom);
  const [points, setPoints] = useState<PointsData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const profile = await memberService.getProfile();
      setUser(profile);
    } catch (error) {
      toast({
        title: "Gagal Memuat Profil",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoadingProfile(false);
    }
  }, [setUser, toast]);

  const fetchPoints = useCallback(async () => {
    setLoadingPoints(true);
    try {
      const pointsData = await memberService.getPoints();
      setPoints(pointsData);
    } catch (error) {
      toast({
        title: "Gagal Memuat Points",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoadingPoints(false);
    }
  }, [toast]);

  return {
    user,
    points,
    loading: loadingProfile || loadingPoints,
    fetchProfile,
    fetchPoints,
  };
}

export function useVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [myVouchers, setMyVouchers] = useState<MyVoucher[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [loadingMyVouchers, setLoadingMyVouchers] = useState(false);
  const { toast } = useToast();

  const fetchVouchers = useCallback(async (filters?: Parameters<typeof voucherService.getAll>[0]) => {
    setLoadingVouchers(true);
    try {
      const data = await voucherService.getAll(filters);
      setVouchers(data);
    } catch (error) {
      toast({
        title: "Gagal Memuat Voucher",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoadingVouchers(false);
    }
  }, [toast]);

  const fetchMyVouchers = useCallback(async () => {
    setLoadingMyVouchers(true);
    try {
      const data = await memberService.getMyVouchers();
      setMyVouchers(data);
    } catch (error) {
      toast({
        title: "Gagal Memuat Voucher Saya",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoadingMyVouchers(false);
    }
  }, [toast]);

  const redeemVoucher = useCallback(async (voucherId: string) => {
    try {
      const redeemedVoucher = await voucherService.redeem(voucherId);
      setMyVouchers(prev => [...prev, redeemedVoucher]);
      toast({
        title: "Voucher Berhasil Ditukar!",
        description: 'Lihat voucher Anda di menu "Voucher Saya".',
      });
      return redeemedVoucher;
    } catch (error) {
      toast({
        title: "Gagal Menukar Voucher",
        description: getErrorMessage(error),
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  return {
    vouchers,
    myVouchers,
    loading: loadingVouchers || loadingMyVouchers,
    fetchVouchers,
    fetchMyVouchers,
    redeemVoucher,
  };
}

export function useHistory() {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await memberService.getHistory();
      setHistory(data);
    } catch (error) {
      toast({
        title: "Gagal Memuat Riwayat",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    history,
    loading,
    fetchHistory,
  };
}

export function usePWA() {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    // Handle online/offline status
    const handleOnline = () => {
      console.log("App is online");
    };

    const handleOffline = () => {
      console.log("App is offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
}
