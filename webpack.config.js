var path = require('path');
const getPreprocessor = require('svelte-preprocess');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPlugins = require('./postcss.config.js');

const mode = process.env.NODE_ENV || 'development';
const isDevBuild = mode !== 'production';

const cssConfig = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    { loader: 'postcss-loader', options: { extract: true, plugins: postcssPlugins(!isDevBuild) } },
  ],
};

console.log('mode', mode);

const preprocess = getPreprocessor({
  transformers: {
    postcss: {
      plugins: postcssPlugins()
    }
  }
});

module.exports = {
  entry: {
    'main': './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, './public/dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  mode,
  module: {
    rules: [      
      cssConfig,
      {
        test: /\.svelte$/,
        use: { loader: 'svelte-loader', options: { 
            dev: isDevBuild, 
            preprocess,
          } 
        },
        exclude: ['/node_modules/']
      },     
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]?[hash]' }
      },
    ]
  },
  resolve: {
    extensions: ['.mjs', '.js', '.json', '.svelte'],
    mainFields: ['svelte', 'module', 'main'],
  },
  performance: {
    hints: false
  },

  plugins: [
    new MiniCssExtractPlugin('main.css'),
  ]
}

if (!isDevBuild) {
  module.exports.optimization = {
    minimize: true,
  }
} else {
  module.exports.devtool = '#source-map';

  module.exports.devServer = {
    port: 8098,
    host: "localhost",
    historyApiFallback: true,
    watchOptions: {aggregateTimeout: 300, poll: 1000},
    contentBase: './public',
    open: true
  };
}