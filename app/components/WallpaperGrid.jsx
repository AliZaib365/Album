  'use client';

  import { useEffect, useRef, useState, useCallback, memo } from 'react';
  import { useRouter } from 'next/navigation';

  const WallpaperGrid = memo(({ wallpapers }) => {
    const router = useRouter();
    const [loadedIndices, setLoadedIndices] = useState(new Set());
    const videoRefs = useRef([]);
    const containerRef = useRef(null);
    const batchSize = 5;

    const formatName = useCallback((name) => {
      if (!name) return 'Live Wallpaper';
      const tags = name.split('#').filter(Boolean);
      const mainTag = tags.length > 0 ? tags[0] : 'Live Wallpaper';
      return mainTag.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    }, []);

    const extractTags = useCallback((name) => {
      if (!name) return [];
      return name.split('#').slice(1).map(tag =>
        tag.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
      );
    }, []);

    const handleMouseEnter = useCallback((index) => {
      const video = videoRefs.current[index];
      if (video && loadedIndices.has(index)) {
        video.play().catch(e => console.debug('Autoplay prevented:', e));
      }
    }, [loadedIndices]);

    const handleMouseLeave = useCallback((index) => {
      const video = videoRefs.current[index];
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }, []);

    const handleWallpaperClick = useCallback((index) => {
      const encodedWallpaper = encodeURIComponent(JSON.stringify(wallpapers[index]));
      router.push(`/wallpaper/${index}?data=${encodedWallpaper}`);
    }, [wallpapers, router]);

    const handleDownload = useCallback((e, item, displayName) => {
      e.stopPropagation();
      
      const a = document.createElement('a');
      a.href = item.media;
      a.setAttribute('download', `${displayName.replace(/[^a-z0-9]/gi, '_')}.mp4`);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 100);
    }, []);

    useEffect(() => {
      if (!wallpapers || wallpapers.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.dataset.index, 10);
              setLoadedIndices(prev => new Set(prev).add(index));
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '200px' }
      );

      const initial = new Set();
      for (let i = 0; i < Math.min(batchSize, wallpapers.length); i++) {
        initial.add(i);
      }
      setLoadedIndices(initial);

      const cards = containerRef.current?.querySelectorAll('[data-observe]');
      cards?.forEach(card => observer.observe(card));

      return () => observer.disconnect();
    }, [wallpapers]);

    if (!wallpapers || wallpapers.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="flex space-x-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
                style={{
                  animation: `pulseFade 1.4s ease-in-out ${i * 0.15}s infinite`,
                  boxShadow: '0 0 14px rgba(139, 92, 246, 0.4)',
                }}
              />
            ))}
          </div>
      
          <style jsx>{`
            @keyframes pulseFade {
              0% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(2); /* Increased scaling */
                opacity: 0.3;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      );
      
    }

    return (
      <div
        ref={containerRef}
        className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 bg-white"
      >
        {wallpapers.map((item, index) => {
          const tags = extractTags(item.name);
          const displayName = formatName(item.name);

          return (
            <div
              key={index}
              data-index={index}
              data-observe={!loadedIndices.has(index)}
              onClick={() => handleWallpaperClick(index)}
              className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 aspect-[4/3] cursor-pointer w-full h-100"
            >
              <video
                ref={el => videoRefs.current[index] = el}
                src={loadedIndices.has(index) ? item.media : undefined}
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                style={{
                  opacity: loadedIndices.has(index) ? 1 : 0,
                  transform: 'translateZ(0)'
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              />

              {/* Download button (top-right corner) */}
              <button
                onClick={(e) => handleDownload(e, item, displayName)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                title="Download"
                aria-label="Download wallpaper"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75v3a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 15.75v-3m-6 3V3m0 12l-3-3m3 3l3-3" />
                </svg>
              </button>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none">
                <div className="w-full">
                  <h3 className="text-white font-medium text-xs sm:text-sm md:text-base truncate">
                    {displayName}
                  </h3>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] sm:text-xs bg-black/40 text-white/80 px-1.5 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Loading spinner */}
              {!loadedIndices.has(index) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-lg">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 sm:border-4 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  });

  WallpaperGrid.displayName = 'WallpaperGrid';
  export default WallpaperGrid;