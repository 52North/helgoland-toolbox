var path = require('path');
var webpack = require('webpack');

// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var aotplugin = require('@ngtools/webpack');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.MODE;
var isProd = ENV === 'build';
var nodeModules = path.join(process.cwd(), 'node_modules');

module.exports = function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  // if (isProd) {
  // config.devtool = 'source-map';
  // } else {
  config.devtool = 'eval-source-map';
  // }

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   */
  config.entry = {
    'polyfills': './demo/src/polyfills.ts',
    'main': './demo/src/main.ts'
  };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   */
  config.output = {
    path: root('demo', 'dist'),
    publicPath: '/',
    filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
    chunkFilename: isProd ? '[id].[hash].chunk.js' : '[id].chunk.js'
  };

  /**
   * Resolve
   * Reference: http://webpack.github.io/docs/configuration.html#resolve
   */
  config.resolve = {
    modules: [root('demo'), 'node_modules'],
    // only discover files that have those extensions
    extensions: ['.ts', '.js', '.css', '.scss', '.html'],

    alias: {
      // '@ng-bootstrap/ng-bootstrap': root('src/index.ts')
    }
  };

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */
  config.module = {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: 'tsconfig.json'
            }
          },
          {
            loader: 'angular2-template-loader'
          }
        ]
      },

      // copy those assets to output
      { test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, use: 'file-loader?name=fonts/[name].[hash].[ext]?' },

      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader']
      },

      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader']
      },

      { test: /\.html$/, use: 'raw-loader' },

      { test: /\.md$/, use: 'html-loader!markdown-loader' }
    ],
    noParse: [/.+zone\.js\/dist\/.+/]
  };

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Define env variables to help with builds
    // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      // Environment helpers
      'process.env': {
        ENV: JSON.stringify(ENV),
        version: JSON.stringify(require('./package.json').version)
      }
    }),

    new CommonsChunkPlugin({
      "name": "vendor",
      "minChunks": (module) => module.resource && module.resource.startsWith(nodeModules),
      "chunks": [
        "main"
      ]
    }),

    new CommonsChunkPlugin({
      names: ['vendor', 'polyfills', 'inline']
    }),

    new CopyWebpackPlugin([
      { from: 'demo/src/assets', to: 'assets' },
      { from: 'demo/src/styles.css', to: 'styles.css' },
      { from: 'node_modules/@angular/material/prebuilt-themes/indigo-pink.css', to: 'indigo-pink.css' },
      { from: 'node_modules/font-awesome/css/font-awesome.css', to: 'font-awesome.css' }
    ]),

    // Inject script and link tags into html files
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: './demo/src/index.html',
      chunksSortMode: 'dependency'
    }),

    // Extract css files
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin({ filename: 'css/[name].[hash].css', disable: !isProd }),

    new webpack.LoaderOptionsPlugin({
      // add debug messages
      debug: !isProd,
      minimize: isProd,
      /**
       * PostCSS
       * Reference: https://github.com/postcss/autoprefixer-core
       * Add vendor prefixes to your css
       */
      postcss: [
        autoprefixer({
          browsers: ['last 2 version']
        })
      ]
    }),

    // Workaround to remove Webpack warning in system_js_ng_module_factory_loader.js
    // See https://github.com/angular/angular/issues/11580
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      root('demo', 'src', 'app')
    )
  ];

  // Add build specific plugins
  // if (isProd) {
  //   config.plugins.push(
  //     // Reference: https://github.com/angular/angular-cli/tree/master/packages/webpack
  //     new aotplugin.AotPlugin({
  //       tsConfigPath: './tsconfig-aot.json',
  //       entryModule: root('demo/src/app/') + 'app.module#NgbdModule'
  //     }),

  //     // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
  //     // Only emit files when there are no errors
  //     new webpack.NoEmitOnErrorsPlugin(),

  //     // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
  //     // Minify all javascript, switch loaders to minimizing mode
  //     new webpack.optimize.UglifyJsPlugin({
  //       mangle: true,
  //       output: {comments: false},
  //       sourceMap: true
  //     }),

  //     // Copy assets from the public folder
  //     // Reference: https://github.com/kevlened/copy-webpack-plugin
  //     new CopyWebpackPlugin([{
  //       from: root('demo/src/public')
  //     }])
  //   );
  // }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: 'demo/src/public',
    historyApiFallback: true,
    stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
  };

  return config;
}();

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
