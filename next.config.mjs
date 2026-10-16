/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local photos in /public/photos are resized and served as AVIF/WebP automatically.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 828, 1080, 1280, 1600],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};
export default nextConfig;
