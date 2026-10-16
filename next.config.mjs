/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a production build live beside the dev server's .next (e.g. NEXT_DIST_DIR=.next-prod).
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
