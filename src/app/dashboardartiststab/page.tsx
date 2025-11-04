// app/artists/page.tsx
import ArtistManagementClient from '../component/dashboard/dashboardartiststab/ArtistManagementClient';
import { getArtistsPaginated, getCategoriesApi } from '@/app/lib/api';
import { buildR2PublicUrl } from '@/app/lib/utils/dashboardartist-utils';

export default async function ArtistsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const page = Number(searchParams?.page || '1') || 1;
  const [artistsResp, categories] = await Promise.all([
    getArtistsPaginated(page),
    getCategoriesApi(),
  ]);

  const categoryIdToName: Record<string, string> = {};
  categories.forEach((c: { id: string; name: string }) => {
    categoryIdToName[c.id] = c.name;
  });

  const artists = (artistsResp?.data || []).map((a: any) => ({
    id: a.id,
    artist_name: a.artist_Name,
    category: categoryIdToName[a.category_id] || 'Unknown',
    category_id: a.category_id,
    intro: a.introduction,
    joining_date: a.joining_date,
    experience: Number(a.experience),
    image: buildR2PublicUrl(a.artist_profile_pic),
  }));

  return (
    <ArtistManagementClient
      initialArtists={artists}
      pagination={{
        currentPage: artistsResp.currentPage,
        totalPages: artistsResp.totalPages,
      }}
    />
  );
}
