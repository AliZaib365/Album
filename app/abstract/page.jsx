'use client';

import { useEffect, useState } from "react";
import WallpaperGrid from "../components/WallpaperGrid";

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
  const category = "Abstract";

  useEffect(() => {
    const fetchWallpapers = async () => {
      // Shuffle the API URL by appending a random query parameter
      const baseUrl = process.env.NEXT_PUBLIC_WALLPAPER_API_ABSTRACT;
      const separator = baseUrl.includes('?') ? '&' : '?';
      const shuffledUrl = `${baseUrl}${separator}shuffle=${Math.random()}`;

      // Fetch wallpapers from the shuffled API URL
      try {
        const res = await fetch(shuffledUrl, {
          cache: "no-store",
        });
        const data = await res.json();
        const fetchedWallpapers = data.categories || [];
        // Shuffle wallpapers array to randomize the display order every time.
        const randomizedWallpapers = shuffleArray(fetchedWallpapers);
        setWallpapers(randomizedWallpapers);
      } catch (err) {
        console.error('Error fetching wallpapers:', err);
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