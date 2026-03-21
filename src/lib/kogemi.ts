const KOGEMI_BASE = "https://kogemi-api-3.onrender.com";

export interface KogemiStreamResponse {
  primary: string;
  backup: string;
}

export interface KogemiAnimeInfo {
  title: string;
  episodes: number;
  status: string;
  year: number;
}

export interface KogemiImdbResponse {
  imdb: string;
  tmdb: number;
}

export async function kogemiSearch(query: string) {
  const res = await fetch(`${KOGEMI_BASE}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Kogemi search failed");
  return res.json();
}

export async function kogemiAnimeInfo(title: string): Promise<KogemiAnimeInfo> {
  const res = await fetch(`${KOGEMI_BASE}/anime-info?title=${encodeURIComponent(title)}`);
  if (!res.ok) throw new Error("Kogemi anime-info failed");
  return res.json();
}

export async function kogemiGetImdb(title: string): Promise<KogemiImdbResponse> {
  const res = await fetch(`${KOGEMI_BASE}/imdb?title=${encodeURIComponent(title)}`);
  if (!res.ok) throw new Error("Kogemi IMDB lookup failed");
  return res.json();
}

export async function kogemiGetStream(imdbId: string, season = 1, episode = 1): Promise<KogemiStreamResponse> {
  const res = await fetch(`${KOGEMI_BASE}/stream?imdb=${encodeURIComponent(imdbId)}&season=${season}&ep=${episode}`);
  if (!res.ok) throw new Error("Kogemi stream failed");
  return res.json();
}
