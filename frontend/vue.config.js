const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  assetsDir: 'assets/',
  filenameHashing: false,

  chainWebpack: config => {
    const imagesRule = config.module.rule("images");
    imagesRule.uses.clear();

    imagesRule.test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
    .use('url-loader')
    .loader('url-loader')
    .tap(options => {
      options = {
        limit: -1,
        name: 'assets/img/[name].[ext]'
      }
      return options
    }).end();

    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();

    svgRule.test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader('file-loader')
    .tap(options => {
      options = {
        limit: -1,
        name: 'assets/fonts/[name].[ext]'
      }
      return options
    }).end();

    const fontsRule = config.module.rule('fonts');
    fontsRule.uses.clear();

    fontsRule.test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .use('url-loader')
    .loader('url-loader')
    .tap(options => {
      options = {
        limit: -1,
        name: 'assets/fonts/[name].[ext]'
      }
      return options
    }).end();

    if(config.plugins.has('extract-css')) {
      const extractCSSPlugin = config.plugin('extract-css')
      extractCSSPlugin && extractCSSPlugin.tap(() => [{
        filename: 'assets/css/[name].css',
        chunkFilename: 'assets/css/[name].css'
      }])
    }

    //config.plugins.delete("html").delete("prefetch").delete("preload");
  },

  pwa: {
    iconPaths: {
      favicon32: 'assets/img/icons/favicon-32x32.png',
      favicon16: 'assets/img/icons/favicon-16x16.png',
      appleTouchIcon: 'assets/img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'assets/img/icons/safari-pinned-tab.svg',
      msTileImage: 'assets/img/icons/msapplication-icon-144x144.png',
      androidChrome192: 'assets/img/icons/android-chrome-192x192',
      androidChrome512: 'assets/img/icons/android-chrome-512x512'
    },
    manifestOptions: {
      icons: [
        {
          src: './assets/img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: './assets/img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: './assets/img/icons/android-chrome-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: './assets/img/icons/android-chrome-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    manifestCrossorigin: 'anonymous'
  },

  configureWebpack: {
    // TODO: turn on for development only
    devtool: process.env.NODE_ENV === 'development' ?  'inline-source-map' : 'source-map',
    plugins: [
        new CopyWebpackPlugin([
            {from:'src/assets/img', to:'assets/img'} ,
            {from:'src/assets/fonts', to:'assets/fonts'} ,
            {from:'src/assets/scss/plugins', to:'assets/css/plugins'} 
        ]),
    ],

    output: {
      filename: 'assets/js/[name].bundle.js',
      chunkFilename: 'assets/js/[name].js'
    }
  },

  lintOnSave: false,
  productionSourceMap: false,
  parallel: false
};
