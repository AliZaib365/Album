'use client';

import Link from 'next/link';
import { memo, useState } from 'react';
import { Bell, PlusSquare, Settings } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="w-full fixed top-0 z-50 bg-white border-b border-gray-100 shadow-sm px-6 py-3 flex items-center justify-between">
      {/* --- Left: Logo --- */}
      <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
        <MainIcon />
        <span className="text-xl font-bold text-pink-600 tracking-wide">4k Wallpaper</span>
      </Link>

      {/* --- Center: Navigation Links (Desktop) --- */}
      <div className="hidden md:flex items-center gap-6">
        <IconLink href="/" icon={<HomeSVG />} label="Home" />
        <IconLink href="/animals" icon={<AnimalSVG />} label="Animals" />
        <IconLink href="/anime" icon={<AnimeSVG />} label="Anime" />
        <IconLink href="/abstract" icon={<AbstractSVG />} label="Abstract" />
        <IconLink href="/allwallpapers" icon={<GallerySVG />} label="All" />
      </div>

      {/* --- Mobile Menu Button --- */}
      <button
        className="md:hidden text-gray-600"
        onClick={toggleMobileMenu}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* --- Right: Utility Icons (Desktop) --- */}
      {/* <div className="hidden md:flex items-center gap-4 text-gray-600">
        <UtilityIcon icon={<PlusSquare size={22} />} tooltip="Upload" />
        <UtilityIcon icon={<Bell size={22} />} tooltip="Notifications" />
        <UtilityIcon icon={<Settings size={22} />} tooltip="Settings" />
      </div> */}

      {/* --- Mobile Menu (Responsive) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-t border-gray-100 p-4 transition-all ease-in-out duration-300">
          <Link href="/" className="block py-2 text-gray-600 hover:text-pink-600">Home</Link>
          <Link href="/animals" className="block py-2 text-gray-600 hover:text-pink-600">Animals</Link>
          <Link href="/anime" className="block py-2 text-gray-600 hover:text-pink-600">Anime</Link>
          <Link href="/abstract" className="block py-2 text-gray-600 hover:text-pink-600">Abstract</Link>
          <Link href="/allwallpapers" className="block py-2 text-gray-600 hover:text-pink-600">All</Link>

          {/* --- Mobile Utility Icons --- */}
          {/* <div className="mt-4 flex justify-between items-center gap-6">
            <UtilityIcon icon={<PlusSquare size={22} />} tooltip="Upload" />
            <UtilityIcon icon={<Bell size={22} />} tooltip="Notifications" />
            <UtilityIcon icon={<Settings size={22} />} tooltip="Settings" />
          </div> */}
        </div>
      )}
    </nav>
  );
};

const IconLink = ({ href, icon, label }) => (
  <Link
    href={href}
    className="relative group flex flex-col items-center text-gray-500 hover:text-pink-600 transition"
  >
    <div className="w-6 h-6">{icon}</div>
    <span className="absolute mt-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 rounded shadow">
      {label}
    </span>
  </Link>
);

const UtilityIcon = ({ icon, tooltip }) => (
  <div className="relative group cursor-pointer hover:text-pink-600 transition-colors">
    {icon}
    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-white px-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
      {tooltip}
    </span>
  </div>
);

// --- Main Logo Icon ---
const MainIcon = () => (
  <svg className="w-8 h-8 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" />
    <path d="M10 16.5l6-4.5-6-4.5v9z" fill="white" />
  </svg>
);

// --- SVGs ---
const HomeSVG = () => (
  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 1.707a1 1 0 00-1.414 0L2 9h2v8a1 1 0 001 1h4V13h2v5h4a1 1 0 001-1V9h2L10.707 1.707z" />
  </svg>
);

const AnimalSVG = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M5 8a3 3 0 016 0v1H5V8zM13 8a3 3 0 116 0v1h-6V8zM5 13v4a3 3 0 003 3h8a3 3 0 003-3v-4H5z" />
  </svg>
);

const AnimeSVG = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M12 4l3 6h-6l3-6zM12 14v6m-6-6a6 6 0 0012 0" />
  </svg>
);

const AbstractSVG = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4" />
    <path d="M2 12h4m12 0h4M12 2v4m0 12v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
  </svg>
);

const GallerySVG = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 15l5-5 4 4 5-5 4 4" />
  </svg>
);

export default memo(Navbar);
