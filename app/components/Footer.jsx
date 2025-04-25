'use client';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 shadow-sm py-6 sm:py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm sm:text-base md:text-lg font-medium text-gray-600">
          &copy; 2025 4k Wallpaper. All Rights Reserved.
        </p>

        {/* Optional Pinterest-style links */}
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors text-sm sm:text-base">
            Terms
          </a>
          <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors text-sm sm:text-base">
            Privacy
          </a>
          <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors text-sm sm:text-base">
            Help
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
