// app/api/artists/route.ts

export interface Artist {
  id: string;
  artist_Name: string;
  artist_profile_pic: string;
  category_id: string;
  category?: string;
  joining_date: string;
  experience: number;
}

export const allArtists: Artist[] = [
  {
    id: "5bdd393c-e4c7-4312-ac0a-0a86c8f2b41c",
    artist_Name: "Dhananjay",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28b",
    category: "Rangoli",
    joining_date: "2025-10-06 13:20:27",
    experience: 5,
  },
  {
    id: "6cee494d-f5d8-5423-bd1b-1b97d9g3c52d",
    artist_Name: "Priya Sharma",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28b",
    category: "Rangoli",
    joining_date: "2024-08-15 10:30:00",
    experience: 8,
  },
  {
    id: "7dff5a5e-g6e9-6434-ce2c-2c08eah4d63e",
    artist_Name: "Rajesh Kumar",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28c",
    category: "Spiritual",
    joining_date: "2023-05-20 14:45:00",
    experience: 12,
  },
  {
    id: "8egg6b6f-h7fa-7545-df3d-3d19fbi5e74f",
    artist_Name: "Anita Verma",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28d",
    category: "Resin",
    joining_date: "2022-11-10 09:15:00",
    experience: 6,
  },
  {
    id: "9fhh7c7g-i8gb-8656-eg4e-4e20gcj6f85g",
    artist_Name: "Suresh Gupta",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28e",
    category: "Shubh Labh",
    joining_date: "2023-01-22 11:20:00",
    experience: 9,
  },
  {
    id: "ag0i8d8h-j9hc-9767-fh5f-5f31hdk7g96h",
    artist_Name: "Neha Patel",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28f",
    category: "Lapdesk",
    joining_date: "2024-03-30 16:50:00",
    experience: 5,
  },
  {
    id: "bh1j9e9i-k0id-a878-gi6g-6g42iel8ha7i",
    artist_Name: "Kavita Joshi",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f29g",
    category: "Diya & Thali",
    joining_date: "2021-07-12 13:25:00",
    experience: 11,
  },
  {
    id: "ci2k0f0j-l1je-b989-hj7h-7h53jfm9ib8j",
    artist_Name: "Arun Mehta",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f29h",
    category: "Decor",
    joining_date: "2023-12-05 10:40:00",
    experience: 10,
  },
  {
    id: "dj3l1g1k-m2kf-ca9a-ik8i-8i64kgn0jc9k",
    artist_Name: "Ritu Singh",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f29i",
    category: "Gift",
    joining_date: "2024-01-18 15:30:00",
    experience: 7,
  },
  {
    id: "ek4m2h2l-n3lg-db0b-jl9j-9j75lho1kd0l",
    artist_Name: "Vikram Singh",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28b",
    category: "Rangoli",
    joining_date: "2024-05-22 12:10:00",
    experience: 4,
  },
  {
    id: "fl5n3i3m-o4mh-ec1c-km0k-0k86lhp2le1m",
    artist_Name: "Deepika Roy",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f29h",
    category: "Decor",
    joining_date: "2023-09-14 08:45:00",
    experience: 6,
  },
  {
    id: "gm6o4j4n-p5ni-fd2d-ln1l-1l97miq3mf2n",
    artist_Name: "Sanjay Verma",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28c",
    category: "Spiritual",
    joining_date: "2022-04-30 14:20:00",
    experience: 10,
  },
  {
    id: "hn7p5k5o-q6oj-ge3e-mo2m-2m08njr4ng3o",
    artist_Name: "Meera Patel",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28d",
    category: "Resin",
    joining_date: "2024-02-28 11:00:00",
    experience: 3,
  },
  {
    id: "io8q6l6p-r7pk-hf4f-np3n-3n19oks5oh4p",
    artist_Name: "Arjun Das",
    artist_profile_pic: "images/man1.jpg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28e",
    category: "Shubh Labh",
    joining_date: "2023-06-11 09:30:00",
    experience: 7,
  },
];

// GET all artists
export async function GET() {
  try {
    return Response.json({
      success: true,
      data: allArtists,
      count: allArtists.length,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to fetch artists",
      },
      { status: 500 }
    );
  }
}

// GET single artist by ID
export async function getArtistById(id: string): Promise<Artist | null> {
  const artist = allArtists.find((a) => a.id === id);
  return artist || null;
}

// GET artists by category
export async function getArtistsByCategory(
  category: string
): Promise<Artist[]> {
  return allArtists.filter((a) => a.category === category);
}

// GET artists by experience range
export async function getArtistsByExperience(
  minExp: number,
  maxExp: number
): Promise<Artist[]> {
  return allArtists.filter(
    (a) => a.experience >= minExp && a.experience <= maxExp
  );
}

// GET unique categories
export async function getCategories(): Promise<string[]> {
  const categories = [
    ...new Set(allArtists.map((a) => a.category).filter(Boolean)),
  ];
  return categories as string[];
}

// Search artists
export async function searchArtists(query: string): Promise<Artist[]> {
  const lowerQuery = query.toLowerCase();
  return allArtists.filter(
    (a) =>
      a.artist_Name.toLowerCase().includes(lowerQuery) ||
      a.category?.toLowerCase().includes(lowerQuery)
  );
}
