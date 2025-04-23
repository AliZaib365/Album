import WallpaperGrid from "../components/WallpaperGrid";

const AbstractPage = async () => {
  // Shuffle the API URL by appending a random query parameter
  const baseUrl = process.env.NEXT_PUBLIC_WALLPAPER_API_ANIMALS;
  const separator = baseUrl.includes("?") ? "&" : "?";
  const shuffledUrl = `${baseUrl}${separator}shuffle=${Math.random()}`;

  const res = await fetch(shuffledUrl, {
    cache: "no-store",
  });

  const data = await res.json();
  const wallpapers = data.categories || [];

  // Manually define the category title for this page
  const category = "ANIMALS"; 

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

export default AbstractPage;  