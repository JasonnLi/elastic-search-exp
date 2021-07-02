const path = require("path");
const webpack = require("webpack");
const Config = require("webpack-config");

module.exports.default = new Config.Config()
  .extend("webpack/webpack.base.config.js")
  .merge({
    name: "development",
    plugins: [
      new webpack.DefinePlugin({
        "process.env.API_URL": JSON.stringify(`http://localhost:3000/api`),
      }),
    ],

    devServer: {
      index: "index.html",
      contentBase: path.join(__dirname, "../dist"),
      compress: true,
      port: 3001,
      host: "0.0.0.0",
      historyApiFallback: true,
      publicPath: "/",
      allowedHosts: ["localhost"],
    },

    mode: "development",
    devtool: "source-map",
  });
