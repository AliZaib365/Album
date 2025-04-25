'use client';

import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  memo,
  useMemo
} from 'react';
import { useRouter } from 'next/navigation';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const DEFAULT_CELL_WIDTH = 350;
const DEFAULT_CELL_HEIGHT = 600;
const GUTTER_SIZE = 8;

// In-memory cache for video blob URLs.
const blobCache = {};

// Helper function to build the proxy URL.
const buildProxyUrl = (originalUrl) => {
  return `/api/proxy?url=${encodeURIComponent(originalUrl)}`;
};

const WallpaperGrid = ({ wallpapers = [] }) => {
  const router = useRouter();
  const videoRefs = useRef({});

  // Format name and extract tags.
  const formatName = useCallback((name) => {
    if (!name) return 'Live Wallpaper';
    const tags = name.split('#').filter(Boolean);
    const mainTag = tags.length > 0 ? tags[0] : 'Live Wallpaper';
    return mainTag.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }, []);

  const extractTags = useCallback((name) => {
    if (!name) return [];
    return name
      .split('#')
      .slice(1)
      .map((tag) =>
        tag.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
      );
  }, []);

  const handleWallpaperClick = useCallback(
    (index) => {
      const encodedWallpaper = encodeURIComponent(
        JSON.stringify(wallpapers[index])
      );
      router.push(`/wallpaper/${index}?data=${encodedWallpaper}`);
    },
    [wallpapers, router]
  );

  const handleDownload = useCallback((e, item, displayName) => {
    e.stopPropagation();
    const proxyUrl = buildProxyUrl(item.media);
    const a = document.createElement('a');
    a.href = proxyUrl;
    a.setAttribute(
      'download',
      `${displayName.replace(/[^a-z0-9]/gi, '_')}.mp4`
    );
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 100);
  }, []);

  // Cell component: always display thumbnail, and play video on hover.
  const Cell = memo(({ columnIndex, rowIndex, style, data }) => {
    const { wallpapers, columnCount } = data;
    const index = rowIndex * columnCount + columnIndex;
    if (index >= wallpapers.length) return null;

    const item = wallpapers[index];
    const displayName = useMemo(
      () => formatName(item.name),
      [item.name, formatName]
    );
    const tags = useMemo(
      () => extractTags(item.name),
      [item.name, extractTags]
    );

    // States for video blob and hover.
    const [blobUrl, setBlobUrl] = useState(null);
    const [isBlobReady, setBlobReady] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Thumbnail URL (loads immediately)
    const thumbUrl =
      item.Thumbnail && item.Thumbnail.length > 0
        ? item.Thumbnail[0].media
        : null;

    const cellRef = useRef(null);

    // Function to load video as blob.
    const loadBlob = useCallback(() => {
      if (blobCache[item.media]) {
        setBlobUrl(blobCache[item.media]);
        setBlobReady(true);
      } else {
        const proxyUrl = buildProxyUrl(item.media);
        fetch(proxyUrl)
          .then((res) => {
            if (!res.ok)
              throw new Error('Network response was not ok');
            return res.blob();
          })
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            blobCache[item.media] = url;
            setBlobUrl(url);
            setBlobReady(true);
          })
          .catch((err) => {
            console.error(`Failed to load video blob at index ${index}:`, err);
            setHasError(true);
          });
      }
    }, [item.media, index]);

    // Preload video blob for first 20 cells; lazy load otherwise.
    useEffect(() => {
      if (index < 20) {
        loadBlob();
      } else {
        const node = cellRef.current;
        if (!node) return;
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                loadBlob();
                observer.disconnect();
              }
            });
          },
          { threshold: 0.25 }
        );
        observer.observe(node);
        return () => observer.disconnect();
      }
    }, [loadBlob, index]);

    // When hovered, start playing video.
    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
      if (!isBlobReady) {
        loadBlob();
      }
    }, [isBlobReady, loadBlob]);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
      const video = videoRefs.current[index];
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }, [index]);

    // Effect to trigger video playback when hovered and video element is ready.
    useEffect(() => {
      if (isHovered && isBlobReady) {
        const video = videoRefs.current[index];
        if (video) {
          video.play().catch((e) => console.debug('Autoplay prevented:', e));
        }
      }
    }, [isHovered, isBlobReady, index]);

    // Render video element only when hovered.
    const videoSrc = isBlobReady ? blobUrl : null;
    const imageSrc = thumbUrl; // always use original thumbnail URL

    return (
      <div
        ref={cellRef}
        style={{
          ...style,
          left: Number(style.left) + GUTTER_SIZE,
          top: Number(style.top) + GUTTER_SIZE,
          width: Number(style.width) - GUTTER_SIZE,
          height: Number(style.height) - GUTTER_SIZE
        }}
        className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => handleWallpaperClick(index)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnail loads immediately in background */}
        {thumbUrl && (
          <img
            src={imageSrc}
            alt={displayName}
            className="absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-500"
            style={{ opacity: isHovered ? 0 : 1 }}
          />
        )}

        {/* Video element: only shown on hover */}
        {isHovered && videoSrc && (
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-500"
            style={{ opacity: isHovered ? 1 : 0 }}
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => {
              console.error(`Failed to load video at index ${index}`);
              setHasError(true);
            }}
          />
        )}

        {/* Skeleton overlay if thumbnail is missing */}
        {!thumbUrl && (
          <Skeleton
            height="100%"
            width="100%"
            style={{
              borderRadius: '10px',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2
            }}
          />
        )}

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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75v3a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 15.75v-3m-6 3V3m0 12l-3-3m3 3l3-3"
            />
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
      </div>
    );
  });

  return (
    <div className="w-full h-[100vh]">
      <AutoSizer>
        {({ height, width }) => {
          const customwidth=2000;
          const isMobile = width < 600;
          const columnCount = isMobile
            ? 1
            : Math.floor(width / (DEFAULT_CELL_WIDTH + GUTTER_SIZE));
          const cellWidth = isMobile ? width - GUTTER_SIZE * 2 : DEFAULT_CELL_WIDTH;
          const cellHeight = isMobile
            ? (cellWidth * DEFAULT_CELL_HEIGHT) / DEFAULT_CELL_WIDTH
            : DEFAULT_CELL_HEIGHT;
          const rowCount = Math.ceil(wallpapers.length / columnCount);

          return (
            <Grid
              columnCount={columnCount}
              columnWidth={cellWidth + GUTTER_SIZE}
              height={height}
              rowCount={rowCount}
              rowHeight={cellHeight + GUTTER_SIZE}
              width={customwidth}
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