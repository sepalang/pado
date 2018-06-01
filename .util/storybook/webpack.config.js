const path = require('path');
const webpack = require('webpack');

require("fs").writeFileSync(__dirname+"/log.json",JSON.stringify({
  vue$: 'vue/dist/vue.esm.js',
  "~/": __dirname,
  "@/": path.resolve(__dirname,"./src"),
  "@layout/": path.resolve(__dirname,"src/layout"),
  "@component/": path.resolve(__dirname,"src/component"),
  "@util/": path.resolve(__dirname,"src/util"),
  "@pado/": path.resolve(__dirname,"../../.src/")
},2,2))

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {},
          // other vue-loader options go here
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
          noquotes: true,
        },
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      "~/": __dirname,
      "@/": path.resolve(__dirname,"./src"),
      "@layout/": path.resolve(__dirname,"src/layout"),
      "@component/": path.resolve(__dirname,"src/component"),
      "@util/": path.resolve(__dirname,"src/util"),
      "@pado/": path.resolve(__dirname,"../../.src/")
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
  },
  performance: {
    hints: false,
  },
  devtool: '#eval-source-map',
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]);
}
