module.exports = cfg => {
  const dev = cfg.env === 'development';

  return {
    map: dev ? { inline: false } : false,
    syntax:  'postcss-scss',
    plugins: [
      require('postcss-nested')(),
      require('postcss-sort-media-queries')(),
      require('autoprefixer')(),
      dev ? null : require('cssnano')()
    ]
  };
};
