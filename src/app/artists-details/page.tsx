import React from 'react'
import ArtistProfile from '../component/product/ArtistProfile'
import ArtistWork from '../component/product/ArtistWork';
import ArtistReviews from '../component/product/ArtistReviews';

interface PageProps {
  searchParams: {
    id?: string;
  };
}

async function page({ searchParams }: PageProps) {
  const artistId = searchParams.id;

  if (!artistId) {
    return (
      <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
        <div className="bg-white rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artist Not Found</h1>
          <p className="text-gray-600">Please select an artist to view their profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ArtistProfile artistId={artistId} />
      <ArtistWork artistId={artistId} />
      <ArtistReviews artistId={artistId} />
    </div>
  )
}

export default page;
