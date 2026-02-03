import apiClient from './api-client';

// Types
export interface OTPRequest {
  nik: string;
  phone: string;
  purpose: 'login' | 'register';
}

export interface OTPVerifyRequest {
  nik: string;
  phone: string;
  otp: string;
}

export interface OTPVerifyResponse {
  token: string;
  user: UserProfile;
}

export interface KTPScanResponse {
  extracted: {
    nik: string;
    name: string;
    dob?: string;
    address?: string;
  };
  confidence?: number;
  warnings?: string[];
  imageId: string;
}

export interface RegisterRequest {
  nik: string;
  phone: string;
  name: string;
  ktpImageId: string;
  extractedData: KTPScanResponse['extracted'];
}

export interface UserProfile {
  id: string;
  nik: string;
  phone: string;
  name: string;
  memberNumber: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  joinedAt: string;
  avatarUrl?: string;
}

export interface PointsData {
  total: number;
  expiryBuckets: Array<{
    points: number;
    expiryDate: string;
  }>;
}

export interface Voucher {
  id: string;
  title: string;
  description: string;
  category: 'hotel' | 'fnb' | 'spa' | 'other';
  branch?: string;
  pointsCost: number;
  originalValue: number;
  validFrom: string;
  validUntil: string;
  termsConditions: string[];
  stock: number;
  imageUrl: string;
}

export interface MyVoucher extends Voucher {
  redeemCode: string;
  redeemedAt: string;
  status: 'active' | 'used' | 'expired';
  usedAt?: string;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'adjust';
  points: number;
  description: string;
  reference: string;
  createdAt: string;
}

// Auth Services
export const authService = {
  requestOTP: async (data: OTPRequest) => {
    const response = await apiClient.post('/auth/request-otp', data);
    return response.data;
  },

  verifyOTP: async (data: OTPVerifyRequest): Promise<OTPVerifyResponse> => {
    const response = await apiClient.post<OTPVerifyResponse>('/auth/verify-otp', data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },
};

// eKYC Services
export const ekycService = {
  scanKTP: async (image: File): Promise<KTPScanResponse> => {
    const formData = new FormData();
    formData.append('ktp_image', image);
    
    const response = await apiClient.post<KTPScanResponse>('/ekyc/ktp/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Member Services
export const memberService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/me');
    return response.data;
  },

  getPoints: async (): Promise<PointsData> => {
    const response = await apiClient.get<PointsData>('/me/points');
    return response.data;
  },

  getMyVouchers: async (): Promise<MyVoucher[]> => {
    const response = await apiClient.get<MyVoucher[]>('/me/vouchers');
    return response.data;
  },

  getHistory: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<Transaction[]>('/me/history');
    return response.data;
  },
};

// Voucher Services
export const voucherService = {
  getAll: async (filters?: {
    category?: string;
    branch?: string;
    minPoints?: number;
    maxPoints?: number;
  }): Promise<Voucher[]> => {
    const response = await apiClient.get<Voucher[]>('/vouchers', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Voucher> => {
    const response = await apiClient.get<Voucher>(`/vouchers/${id}`);
    return response.data;
  },

  redeem: async (id: string): Promise<MyVoucher> => {
    const response = await apiClient.post<MyVoucher>(`/vouchers/${id}/redeem`);
    return response.data;
  },
};
