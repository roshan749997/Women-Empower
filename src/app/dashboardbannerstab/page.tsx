// app/admin/banners/page.tsx
import { Suspense } from 'react';
import { fetchBannersServer } from '@/app/lib/bannerApi';
import BannerManagementClient from '../component/dashboard/dashboard-banner-tab/BannerManagementClient';
import BannerPageSkeleton from '../component/dashboard/dashboard-banner-tab/BannerPageSkeleton';

// This is a Server Component
export default async function BannersPage() {
  // Fetch data on server
  const initialBanners = await fetchBannersServer();

  return (
    <Suspense fallback={<BannerPageSkeleton />}>
      <BannerManagementClient initialBanners={initialBanners} />
    </Suspense>
  );
}

// Optional: Add metadata
export const metadata = {
  title: 'Banner Management | Admin',
  description: 'Manage website banners and promotional content',
};

// Optional: Revalidate data every 60 seconds
export const revalidate = 60;