"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function WallpaperDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef(null);
  const [wallpaper, setWallpaper] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blobVideoUrl, setBlobVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState(''); // New state for thumbnail

  // Fetch wallpaper data from the URL search parameters.
  useEffect(() => {
    const encodedData = searchParams.get('data');
    if (encodedData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(encodedData));
        setWallpaper(decodedData);
      } catch (error) {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  // Set thumbnail URL if wallpaper includes a thumbnail property. Otherwise, you can use a fallback.
  useEffect(() => {
    if (wallpaper) {
      // If your wallpaper object has a "thumbnail" property, use it.
      // Otherwise, customize this logic as needed.
      setThumbnailUrl(wallpaper.thumbnail || '');
    }
  }, [wallpaper]);

  // Once wallpaper is loaded, fetch the media as a blob and create a blob URL for preview.
  useEffect(() => {
    let currentBlobUrl = '';
    const fetchBlob = async () => {
      if (wallpaper && wallpaper.media) {
        try {
          const proxyUrl = `/api/proxy?url=${encodeURIComponent(wallpaper.media)}`;
          const response = await fetch(proxyUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch media');
          }
          const blob = await response.blob();
          currentBlobUrl = URL.createObjectURL(blob);
          setBlobVideoUrl(currentBlobUrl);
        } catch (error) {
          console.error('Error loading media as blob:', error);
        }
      }
    };

    fetchBlob();

    return () => {
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [wallpaper]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Download handler that creates an anchor element 
  const handleDownload = () => {
    if (!blobVideoUrl || !wallpaper) return;
    const link = document.createElement('a');
    link.href = blobVideoUrl;
    link.download = `${formatName(wallpaper.name)}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format the wallpaper name for display.
  const formatName = (name) => {
    if (!name) return 'Live_Wallpaper';
    const tags = name.split('#').filter(Boolean);
    const mainTag = tags.length ? tags[0] : 'Live_Wallpaper';
    return mainTag.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, '_').trim();
  };

  const extractTags = (name) => {
    if (!name) return [];
    return name
      .split('#')
      .slice(1)
      .map((tag) =>
        tag.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
      );
  };

  if (!wallpaper || !blobVideoUrl) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = formatName(wallpaper.name);
  const tags = extractTags(wallpaper.name);
  const category = searchParams.get('category') || '';

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 pt-24 pb-16 relative font-sans">
      {/* Back Button: using router.back() */}
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-50 bg-gray-100 hover:bg-gray-200 shadow-md rounded-full p-3 transition"
        aria-label="Go back"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>

      {/* Video Preview Section */}
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-50">
        <video
          ref={videoRef}
          src={blobVideoUrl}
          muted
          loop
          playsInline
          autoPlay
          poster={thumbnailUrl} // Use thumbnail as the poster image for immediate display
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full max-h-[520px] object-contain bg-black"
          aria-label="Wallpaper preview"
        />
      </div>

      {/* Wallpaper Information */}
      <div className="text-center mt-10">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{displayName}</h1>
        {tags.length > 0 && (
          <div className="mt-4 flex justify-center gap-2 flex-wrap">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-sm px-4 py-1 rounded-full bg-gray-200 text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-10 flex flex-wrap justify-center gap-6">
        <button
          onClick={togglePlay}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md flex items-center gap-2 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={handleDownload}
          className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-xl shadow-md flex items-center gap-2 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label="Download wallpaper"
        >
          Download
        </button>
      </div>
    </div>
  );
}

const PlayIcon = () => (
  <svg
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4l15 8-15 8V4z" />
  </svg>
);

const PauseIcon = () => (
  <svg
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6" />
  </svg>
);

export default WallpaperDetailPage;