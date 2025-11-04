// types/banner.ts
export type BannerType = 'home_banner' | 'home_showcase' | 'home_giftsection';

export interface Banner {
  id: string;
  type: BannerType;
  img_url: string;
  createdAt: string;
}

export interface BannerTypeConfig {
  label: string;
  description: string;
  maxCount: number;
  recommended: string;
}

export interface CreateBannerDTO {
  type: BannerType;
  img_url: string;
}

export interface UpdateBannerDTO {
  img_url: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const BANNER_TYPE_CONFIG: Record<BannerType, BannerTypeConfig> = {
  home_banner: {
    label: 'Home Banner',
    description: 'Main banner at the top of homepage',
    maxCount: Infinity,
    recommended: '1200x400px'
  },
  home_showcase: {
    label: 'Home Showcase',
    description: 'Multiple showcase banners',
    maxCount: Infinity,
    recommended: '600x400px'
  },
  home_giftsection: {
    label: 'Gift Section',
    description: 'Single gift section banner',
    maxCount: 1,
    recommended: '800x600px'
  }
};