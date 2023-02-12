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
      },
      {
        source: '/legal/personal-data-privacy',
        destination: '/html/personal-data-privacy.html'
      },
      {
        source: '/legal/special-terms',
        destination: '/html/special-terms.html'
      }
    ]
  }
}

module.exports = nextConfig
