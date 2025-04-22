'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useState } from 'react';

const fallbackImages = {
  animals: 'https://reelbuckets.nyc3.cdn.digitaloceanspaces.com/wallpaper_app/wallpaperCategory1739883583.jpg',
  anime: 'https://reelbuckets.nyc3.cdn.digitaloceanspaces.com/wallpaper_app/wallpaperCategory1737533223.jpg',
  abstract: 'https://reelbuckets.nyc3.cdn.digitaloceanspaces.com/wallpaper_app/wallpaperCategory1737533273.jpg',
  default: 'https://reelbuckets.nyc3.cdn.digitaloceanspaces.com/wallpaper_app/wallpaperCategory1739883583.jpg',
};

const CategoryCard = ({ category }) => {
  const [imageSrc, setImageSrc] = useState(category.image);

  const categoryUrl = useCallback(
    () => `/${category.name.toLowerCase()}`,
    [category.name]
  );

  const handleImageError = () => {
    const fallback =
      fallbackImages[category.name.toLowerCase()] || fallbackImages.default;
    setImageSrc(fallback);
  };

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 p-4 aspect-[4/3]">
      <Link 
        href={categoryUrl()} 
        prefetch={false}
        className="block h-full"
      >
        <div className="relative h-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 will-change-transform">
          <Image
            src={imageSrc}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover transform hover:scale-105 transition-transform duration-300"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,[YOUR_BASE64_PLACEHOLDER]"
            loading="lazy"
            decoding="async"
            onError={handleImageError}
            unoptimized={process.env.NODE_ENV !== 'production'}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h3 className="text-white text-2xl font-semibold tracking-wide drop-shadow-lg px-4 text-center">
              {category.name}
            </h3>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
