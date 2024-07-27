module.exports = {
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
