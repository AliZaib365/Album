import WallpaperGrid from "../components/WallpaperGrid";

const AnimalsPage = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_WALLPAPER_API_ANIMALS, {
    cache: 'no-store',
  });

  const data = await res.json();
  const wallpapers = data.categories || [];
  const category = "Animals"
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