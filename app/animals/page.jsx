'use client';

import { useEffect, useState } from "react";
import WallpaperGrid from "../components/WallpaperGrid";

const AnimalsPage = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const category = "Animals";
  const CACHE_NAME = "animals-wallpapers-cache";
  const CACHE_KEY = "animals-wallpapers-data";

  // Function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        // First try to get wallpapers from Cache Storage
        if ('caches' in window) {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(CACHE_KEY);
          
          if (cachedResponse) {
            const cachedData = await cachedResponse.json();
            setWallpapers(shuffleArray(cachedData));
            return;
          }
        }

        // If not in cache, fetch from API
        const baseUrl = process.env.NEXT_PUBLIC_WALLPAPER_API_ANIMALS;
        const res = await fetch(baseUrl, { cache: "no-store" });
        const data = await res.json();
        const fetchedWallpapers = data.categories || [];
        const shuffledWallpapers = shuffleArray(fetchedWallpapers);
        
        setWallpapers(shuffledWallpapers);

        // Store in Cache Storage
        if ('caches' in window) {
          try {
            const cache = await caches.open(CACHE_NAME);
            const response = new Response(JSON.stringify(shuffledWallpapers), {
              headers: { 'Content-Type': 'application/json' },
            });
            await cache.put(CACHE_KEY, response);
          } catch (cacheError) {
            console.error("Error saving to cache:", cacheError);
          }
        }
      } catch (error) {
        console.error("Error fetching wallpapers:", error);
      }
    };

    fetchWallpapers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center text-4xl sm:text-5xl font-bold tracking-tight text-[#e60076] mb-10 transition-colors mt-20">
        <span className="capitalize">{category}</span> Wallpapers
      </h1>

      <WallpaperGrid wallpapers={wallpapers} />
    </div>
  );
};

export default AnimalsPage; 