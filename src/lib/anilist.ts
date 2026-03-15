import type { Anime, AniListResponse, AnimeDetailResponse } from "./types";

const ANILIST_URL = "https://graphql.anilist.co";

const MEDIA_FRAGMENT = `
  id
  title { romaji english native }
  description
  coverImage { extraLarge large color }
  bannerImage
  genres
  averageScore
  episodes
  duration
  seasonYear
  season
  status
  studios { nodes { name } }
  format
  trending
`;

async function queryAniList(query: string, variables: Record<string, unknown> = {}): Promise<unknown> {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`AniList API error: ${res.status}`);
  return res.json();
}

export async function getTrendingAnime(page = 1, perPage = 20): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC, isAdult: false) { ${MEDIA_FRAGMENT} }
      }
    }
  `;
  const data = (await queryAniList(query, { page, perPage })) as AniListResponse;
  return data.data.Page.media;
}

export async function getPopularAnime(page = 1, perPage = 20): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) { ${MEDIA_FRAGMENT} }
      }
    }
  `;
  const data = (await queryAniList(query, { page, perPage })) as AniListResponse;
  return data.data.Page.media;
}

export async function getTopRatedAnime(page = 1, perPage = 20): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: SCORE_DESC, isAdult: false) { ${MEDIA_FRAGMENT} }
      }
    }
  `;
  const data = (await queryAniList(query, { page, perPage })) as AniListResponse;
  return data.data.Page.media;
}

export async function getAnimeByGenre(genre: string, page = 1, perPage = 20): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int, $genre: String) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, genre: $genre, sort: POPULARITY_DESC, isAdult: false) { ${MEDIA_FRAGMENT} }
      }
    }
  `;
  const data = (await queryAniList(query, { page, perPage, genre })) as AniListResponse;
  return data.data.Page.media;
}

export async function searchAnime(search: string, page = 1, perPage = 20): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int, $search: String) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, search: $search, sort: SEARCH_MATCH, isAdult: false) { ${MEDIA_FRAGMENT} }
      }
    }
  `;
  const data = (await queryAniList(query, { page, perPage, search })) as AniListResponse;
  return data.data.Page.media;
}

export async function getAnimeById(id: number): Promise<Anime> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) { ${MEDIA_FRAGMENT} }
    }
  `;
  const data = (await queryAniList(query, { id })) as AnimeDetailResponse;
  return data.data.Media;
}

export async function getRecentAnime(page = 1, perPage = 20): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: START_DATE_DESC, status: RELEASING, isAdult: false) { ${MEDIA_FRAGMENT} }
      }
    }
  `;
  const data = (await queryAniList(query, { page, perPage })) as AniListResponse;
  return data.data.Page.media;
}
