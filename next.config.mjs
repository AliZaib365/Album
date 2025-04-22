/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['reelbuckets.nyc3.cdn.digitaloceanspaces.com'], // Allow this domain for image loading
      unoptimized: false, // Optional: Set to true if you want to disable Next.js image optimization for external images
    },
  };
  
  export default nextConfig;
  