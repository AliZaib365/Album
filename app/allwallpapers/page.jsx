// app/allwallpapers/page.jsx
'use client';

import { useEffect, useState } from 'react';
import WallpaperGrid from '../components/WallpaperGrid';

const AllWallpapersPage = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const responses = await Promise.all([
          fetch(process.env.NEXT_PUBLIC_WALLPAPER_API_ANIMALS),
          fetch(process.env.NEXT_PUBLIC_WALLPAPER_API_ANIME),
          fetch(process.env.NEXT_PUBLIC_WALLPAPER_API_ABSTRACT),
        ]);

        const data = await Promise.all(responses.map((res) => res.json()));

        const allWallpapers = data.reduce((acc, curr) => {
          if (curr.categories) {
            acc.push(...curr.categories);
          }
          return acc;
        }, []);

        setWallpapers(allWallpapers);
      } catch (err) {
        console.error('Error fetching wallpapers:', err);
        setError('Failed to load wallpapers');
      }
    };

    fetchWallpapers();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }
  const category = "All "
  return (
    <div className="container mx-auto p-4">
      <h1
        className="text-center text-4xl sm:text-5xl font-bold tracking-tight text-[#e60076] mb-10 transition-colors mt-20"
      >
        <span className="capitalize">{category}</span> Wallpapers
      </h1>


      {/* Wallpaper Grid Component */}
      <WallpaperGrid wallpapers={wallpapers} />
    </div>
  );
};

export default AllWallpapersPage;
