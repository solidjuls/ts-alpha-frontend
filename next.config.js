module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Force CJS resolution for server build — @reduxjs/toolkit (via recharts)
      // ships legacy ESM under the "module" condition that can't be require()'d
      config.resolve.conditionNames = ['node', 'require', 'default'];
    }
    return config;
  },
};
