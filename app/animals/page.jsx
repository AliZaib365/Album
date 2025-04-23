  'use client';

  import { useEffect, useState } from "react";
  import WallpaperGrid from "../components/WallpaperGrid";

  const AnimalsPage = () => {
    const [wallpapers, setWallpapers] = useState([]);
    const category = "Animals";
    const LOCAL_STORAGE_KEY = "animalsWallpapers";

    useEffect(() => {
      const fetchWallpapers = async () => {
        // Check if wallpapers are already stored in local storage
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
          setWallpapers(JSON.parse(storedData));
        } else {
          // Fetch wallpapers from the API if not found in local storage
          const res = await fetch(process.env.NEXT_PUBLIC_WALLPAPER_API_ANIMALS, {
            cache: "no-store",
          });
          const data = await res.json();
          const fetchedWallpapers = data.categories || [];
          setWallpapers(fetchedWallpapers);

          // Save the fetched wallpapers to local storage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fetchedWallpapers));
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