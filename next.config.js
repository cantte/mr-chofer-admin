/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  async rewrites () {
    return [
      {
        source: '/legal/terms',
        destination: '/html/terms-and-conditions.html'
      },
      {
        source: '/legal/vehicle-leasing-terms',
        destination: '/html/vehicle-leasing-contract.html'
      }
    ]
  }
}

module.exports = nextConfig
