// CustomCard.js
'use client';

import Link from 'next/link';

const CustomCard = () => {
    return (
        <div className="w-full sm:w-1/2 md:w-1/3 p-4 ">
            <Link href="/allwallpapers">
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-tr from-white/10 to-white/5 backdrop-blur-md border border-white/10">
                    {/* Image added here */}
                    <img
                        src="https://png.pngtree.com/thumb_back/fh260/background/20230605/pngtree-halloween-moon-wallpaper-is-the-latest-wallpaper-category-of-new-halloween-image_2880544.jpg" // Replace with your own image URL
                        alt="All Wallpapers"
                        className="w-full h-90 object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h3 className="text-white text-3xl font-semibold tracking-wide drop-shadow-lg">
                            All Wallpapers
                        </h3>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default CustomCard;
