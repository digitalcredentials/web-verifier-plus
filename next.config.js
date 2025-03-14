/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir:true,
  //  transpilePackages: ['digitalcredentials/ed25519-multikey'],
  //  esmExternals: true
  },
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.module.rules.push({
      test: /\.(?:js|ts)$/,
      include: [/node_modules\/(undici)/],
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["next/babel"],
            plugins: [
              "@babel/plugin-transform-private-property-in-object",
              "@babel/plugin-transform-private-methods", 
            ],
          },
        },
      ],
    });
    return config;
  },
};


module.exports = nextConfig