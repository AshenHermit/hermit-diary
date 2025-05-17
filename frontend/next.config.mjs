/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/uploads/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3030/api"
          }/uploads/:path*/`,
        },
      ],
    };
  },
};

export default nextConfig;
