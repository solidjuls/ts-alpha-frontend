module.exports = {
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  // Other configurations can go here
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Extend your webpack configuration here if needed

    // Example: Add a custom plugin
    // config.plugins.push(new webpack.DefinePlugin({
    //   'process.env.CUSTOM_VARIABLE': JSON.stringify('my-value'),
    // }));

    return config;
  },
};
