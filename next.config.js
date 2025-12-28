/** @type {import('next').NextConfig} */
// Only use basePath when explicitly building for GitHub Pages
// Set GITHUB_PAGES=true when building for GitHub Pages deployment
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/plant-breeding' : '';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Only use basePath for GitHub Pages deployment
  ...(basePath && {
    basePath,
    assetPrefix: basePath,
  }),
}

module.exports = nextConfig

