/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If deploying to a subdirectory, uncomment and set your repository name:
  // basePath: '/plant-breeding',
  // assetPrefix: '/plant-breeding',
}

module.exports = nextConfig

