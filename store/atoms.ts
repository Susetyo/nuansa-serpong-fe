import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import type { 
  UserProfile, 
  PointsData, 
  Voucher, 
  MyVoucher, 
  Transaction,
  KTPScanResponse 
} from '@/lib/api-services';

// Auth atoms
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const authStorage = createJSONStorage<AuthState>(() => localStorage);

export const authAtom = atomWithStorage<AuthState>('auth_state', {
  token: null,
  isAuthenticated: false,
}, authStorage);

// Derived atom for checking auth
export const isAuthenticatedAtom = atom((get) => get(authAtom).isAuthenticated);

// Register flow atoms
export type RegisterStep = 'form' | 'ktp' | 'scanning' | 'verify' | 'otp';
export type KTPScanStatus = 'idle' | 'uploading' | 'scanning' | 'success' | 'error';

export interface RegisterState {
  step: RegisterStep;
  formData: {
    name: string;
    phone: string;
    nik: string;
  };
  ktpImage: string | null;
  ktpScanResult: KTPScanResponse | null;
  ktpScanStatus: KTPScanStatus;
  ktpScanError: string | null;
  isNikMatched: boolean | null;
}

export const registerAtom = atom<RegisterState>({
  step: 'form',
  formData: {
    name: '',
    phone: '',
    nik: '',
  },
  ktpImage: null,
  ktpScanResult: null,
  ktpScanStatus: 'idle',
  ktpScanError: null,
  isNikMatched: null,
});

// OTP verification atoms
export interface OTPState {
  purpose: 'login' | 'register';
  nik: string;
  phone: string;
  countdown: number;
  canResend: boolean;
}

export const otpAtom = atom<OTPState>({
  purpose: 'login',
  nik: '',
  phone: '',
  countdown: 60,
  canResend: false,
});

// User profile atom
const userStorage = createJSONStorage<UserProfile | null>(() => localStorage);
export const userAtom = atomWithStorage<UserProfile | null>('user_profile', null, userStorage);

// Points atom - primitive
export const pointsAtom = atom<PointsData | null>(null);

// Vouchers atoms
export const voucherListAtom = atom<Voucher[]>([]);

export const voucherFiltersAtom = atom<{
  category: string | null;
  branch: string | null;
  minPoints: number | null;
  maxPoints: number | null;
}>({
  category: null,
  branch: null,
  minPoints: null,
  maxPoints: null,
});

// My vouchers atom
export const myVouchersAtom = atom<MyVoucher[]>([]);

// Transaction history atom
export const historyAtom = atom<Transaction[]>([]);

// Loading states
export interface LoadingState {
  profile: boolean;
  points: boolean;
  vouchers: boolean;
  myVouchers: boolean;
  history: boolean;
}

export const loadingAtom = atom<LoadingState>({
  profile: false,
  points: false,
  vouchers: false,
  myVouchers: false,
  history: false,
});

// Offline indicator
export const isOfflineAtom = atom<boolean>(false);

// PWA install prompt
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const pwaPromptAtom = atom<BeforeInstallPromptEvent | null>(null);
