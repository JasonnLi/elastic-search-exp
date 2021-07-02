const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Config = require("webpack-config");

module.exports.default = new Config.Config().merge({
  name: "base",
  entry: ["./src/index.tsx", "./src/styles/index.scss"],
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "../dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Bondi Labs Code Test",
      filename: "index.html",
      inject: false,
      baseUrl: "/",
      template: path.join(__dirname, "../index.html"),
    }),
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          filename: "vendors.bundle.js",
          chunks: "all",
        },
      },
    },
  },

  resolve: {
    alias: {},
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "../dist/css/main.css",
            },
          },
          {
            loader: "extract-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader?name=[name].[ext]",
          {
            loader: "image-webpack-loader",
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "../dist/css/antd.css",
            },
          },
          {
            loader: "extract-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
            },
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
    ],
  },
});
