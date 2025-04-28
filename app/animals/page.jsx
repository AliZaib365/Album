'use client';

import { useEffect, useState } from "react";
import WallpaperGrid from "../components/WallpaperGrid";

// Global variable to cache wallpapers on the client.
// This cache survives client-side navigations but will be reset on a full page reload.
let animalsWallpapersCache = null;

// Utility function to shuffle an array using the Fisher-Yates algorithm.
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const AnimalsPage = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const category = "Animals";

  useEffect(() => {
    // If wallpapers are already cached due to client-side navigation,
    // use the cached result instead of refetching and reshuffling.
    if (animalsWallpapersCache) {
      setWallpapers(animalsWallpapersCache);
      return;
    }

    const fetchWallpapers = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_WALLPAPER_API_ANIMALS;
      const separator = baseUrl.includes('?') ? '&' : '?';
      // Append a random query parameter to defeat caching from the API
      const shuffledUrl = `${baseUrl}${separator}shuffle=${Math.random()}`;

      try {
        const res = await fetch(shuffledUrl, {
          cache: "no-store",
        });
        const data = await res.json();
        const fetchedWallpapers = data.categories || [];
        // Shuffle wallpapers array to randomize the display order.
        const randomizedWallpapers = shuffleArray(fetchedWallpapers);
        // Cache the result so it persists on client-side navigations.
        animalsWallpapersCache = randomizedWallpapers;
        setWallpapers(randomizedWallpapers);
      } catch (err) {
        console.error("Error fetching wallpapers:", err);
      }
    };

    fetchWallpapers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className="text-center text-4xl sm:text-5xl font-bold tracking-tight text-[#e60076] mb-10 transition-colors mt-20"
      >
        <span className="capitalize">{category}</span> Wallpapers
      </h1>

      <WallpaperGrid wallpapers={wallpapers} />
    </div>
  );
};

export default AnimalsPage;