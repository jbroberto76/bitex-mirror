/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 100],
  },
  env: {
    IMG_URL: "",
  },
};

module.exports = nextConfig;
