'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const CELL_WIDTH = 350;
const CELL_HEIGHT = 600;
const GUTTER_SIZE = 8;
const LOCAL_STORAGE_KEY = 'wallpapersData';

const WallpaperGrid = ({ wallpapers }) => {
  const router = useRouter();
  const videoRefs = useRef({});

  // Store wallpapers to local storage when loaded.
  useEffect(() => {
    if (wallpapers && wallpapers.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wallpapers));
    }
  }, [wallpapers]);

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
    if (video) {
      video.play().catch(e => console.debug('Autoplay prevented:', e));
    }
  }, []);

  const handleMouseLeave = useCallback((index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  const handleWallpaperClick = useCallback(
    (index) => {
      const encodedWallpaper = encodeURIComponent(JSON.stringify(wallpapers[index]));
      router.push(`/wallpaper/${index}?data=${encodedWallpaper}`);
    },
    [wallpapers, router]
  );

  // Updated handleDownload to use pre-converted blob URL if available.
  const handleDownload = useCallback((e, item, displayName) => {
    e.stopPropagation();
    const a = document.createElement('a');
    // Use blobUrl if available; otherwise fallback to original media URL.
    a.href = item.blobUrl || item.media;
    a.setAttribute('download', `${displayName.replace(/[^a-z0-9]/gi, '_')}.mp4`);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 100);
  }, []);

  const Cell = ({ columnIndex, rowIndex, style, data }) => {
    const { wallpapers, columnCount } = data;
    const index = rowIndex * columnCount + columnIndex;
    if (index >= wallpapers.length) return null;

    const item = wallpapers[index];
    const displayName = formatName(item.name);
    const tags = extractTags(item.name);

    return (
      <div
        style={{
          ...style,
          left: Number(style.left) + GUTTER_SIZE,
          top: Number(style.top) + GUTTER_SIZE,
          width: Number(style.width) - GUTTER_SIZE,
          height: Number(style.height) - GUTTER_SIZE,
        }}
        className="w-screen flex flex-wrap relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => handleWallpaperClick(index)}
      >
        <video
          ref={el => (videoRefs.current[index] = el)}
          // Use blobUrl for video source if available, otherwise use the original media URL.
          src={item.blobUrl || item.media}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          style={{ opacity: 1, transform: 'translateZ(0)' }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onError={() => console.error(`Failed to load video at index ${index}`)}
        />

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

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none">
          <div className="w-full">
            <h3 className="text-white font-medium text-xs sm:text-sm md:text-base truncate">
              {displayName}
            </h3>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[10px] sm:text-xs bg-black/40 text-white/80 px-1.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[100vh]">
      <AutoSizer>
        {({ height, width }) => {
          const columnCount = Math.floor(width / (CELL_WIDTH + GUTTER_SIZE)) || 1;
          const rowCount = Math.ceil(wallpapers.length / columnCount);
          return (
            <Grid
              columnCount={columnCount}
              columnWidth={CELL_WIDTH + GUTTER_SIZE}
              height={height}
              rowCount={rowCount}
              rowHeight={CELL_HEIGHT + GUTTER_SIZE}
              width={width}
              itemData={{ wallpapers, columnCount }}
            >
              {Cell}
            </Grid>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default WallpaperGrid;