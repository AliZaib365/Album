'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function WallpaperDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef(null);
  const [wallpaper, setWallpaper] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch wallpaper data from URL query parameters
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

  // Convert the wallpaper URL into a blob URL for preview & download
  useEffect(() => {
    let tempUrl;
    let abort = false;
    async function toBlobUrl() {
      if (!wallpaper?.media) return;
      try {
        const response = await fetch(wallpaper.media);
        if (!response.ok) throw new Error('Failed to fetch media');
        const blob = await response.blob();
        tempUrl = URL.createObjectURL(blob);
        if (!abort) setBlobUrl(tempUrl);
      } catch {
        // Fallback: use the original URL if blob conversion fails
        if (!abort) setBlobUrl(wallpaper.media);
      }
    }
    toBlobUrl();
    return () => {
      abort = true;
      if (tempUrl) URL.revokeObjectURL(tempUrl);
    };
  }, [wallpaper]);

  const formatName = (name) => {
    if (!name) return 'Live Wallpaper';
    const tags = name.split('#').filter(Boolean);
    const mainTag = tags.length > 0 ? tags[0] : 'Live Wallpaper';
    return mainTag.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
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

  // Trigger the download directly when the button is hit.
  const handleDownload = (e) => {
    // Prevent any default behavior
    e.preventDefault();
    
    if (!blobUrl || !wallpaper) return;
    
    setIsDownloading(true);
    
    // Create an anchor element, assign the blob URL, and simulate click immediately.
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${formatName(wallpaper.name).replace(/[^a-z0-9]/gi, '_')}.mp4`;
    
    // Append link to body and trigger click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsDownloading(false);
  };

  if (!wallpaper || !blobUrl) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = formatName(wallpaper.name);
  const tags = extractTags(wallpaper.name);
  const category = searchParams.get('category');

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 pt-24 pb-16 relative font-sans">
      {/* Back Button */}
      <Link href={`/${category}`} className="absolute top-6 left-6 z-50">
        <div className="bg-gray-100 hover:bg-gray-200 shadow-md rounded-full p-3 transition">
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </div>
      </Link>

      {/* Video Section */}
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-50">
        <video
          ref={videoRef}
          src={blobUrl}
          muted
          loop
          playsInline
          autoPlay
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full max-h-[520px] object-contain bg-black"
        />
      </div>

      {/* Info Section */}
      <div className="text-center mt-10">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{displayName}</h1>
        {tags.length > 0 && (
          <div className="mt-4 flex justify-center gap-2 flex-wrap">
            {tags.map((tag, idx) => (
              <span key={idx} className="text-sm px-4 py-1 rounded-full bg-gray-200 text-gray-700">
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
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md flex items-center gap-2 font-semibold"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          type="button"
          className="bg-gray-800 cursor-pointer hover:bg-gray-900 text-white px-6 py-2 rounded-xl shadow-md flex items-center gap-2 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isDownloading ? <SpinnerIcon /> : <DownloadIcon />}
          {isDownloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  );
}

// Icons
const PlayIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 4l15 8-15 8V4z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);