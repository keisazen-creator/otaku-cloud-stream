export interface Anime {
  id: number;
  idMal: number | null;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  description: string | null;
  coverImage: {
    extraLarge: string;
    large: string;
    color: string | null;
  };
  bannerImage: string | null;
  genres: string[];
  averageScore: number | null;
  episodes: number | null;
  duration: number | null;
  seasonYear: number | null;
  season: string | null;
  status: string | null;
  studios: {
    nodes: { name: string }[];
  };
  format: string | null;
  trending: number | null;
}

export interface AniListResponse {
  data: {
    Page: {
      media: Anime[];
    };
  };
}

export interface AnimeDetailResponse {
  data: {
    Media: Anime;
  };
}
