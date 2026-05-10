/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "faithfulheartsbooks.com",
          },
        ],
        destination: "https://www.faithfulheartsbooks.com/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
