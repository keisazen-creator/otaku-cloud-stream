import { useState, useEffect } from "react";

export interface ContinueWatchingItem {
  animeId: number;
  animeTitle: string;
  animeImage: string;
  episode: number;
  totalEpisodes: number;
  progress: number; // 0-1
  updatedAt: number;
}

const STORAGE_KEY = "otakucloud_continue_watching";

function getItems(): ContinueWatchingItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveItems(items: ContinueWatchingItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useContinueWatching() {
  const [items, setItems] = useState<ContinueWatchingItem[]>(getItems);

  useEffect(() => {
    const handler = () => setItems(getItems());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const updateProgress = (item: Omit<ContinueWatchingItem, "updatedAt">) => {
    const current = getItems();
    const idx = current.findIndex((i) => i.animeId === item.animeId);
    const newItem = { ...item, updatedAt: Date.now() };
    if (idx >= 0) {
      current[idx] = newItem;
    } else {
      current.unshift(newItem);
    }
    const updated = current.slice(0, 20); // keep max 20
    saveItems(updated);
    setItems(updated);
  };

  const removeItem = (animeId: number) => {
    const updated = getItems().filter((i) => i.animeId !== animeId);
    saveItems(updated);
    setItems(updated);
  };

  return {
    items: items.sort((a, b) => b.updatedAt - a.updatedAt),
    updateProgress,
    removeItem,
  };
}
