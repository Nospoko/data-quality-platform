/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/guide',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
