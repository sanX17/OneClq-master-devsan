/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "duvkqyl7kf0ff.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "cdn.oneclq.com",
      },
    ],
  },
};

module.exports = nextConfig;
