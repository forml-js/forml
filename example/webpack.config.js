const path = require("path");
const webpack = require("webpack");
module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: path.resolve("./src/index.js"),
  output: {
    filename: "bundle.js",
    publicPath: "/",
    path: path.resolve("../dist"),
  },
  devtool: process.env.NODE_ENV === "production" ? false : "eval-source-map",
  resolve: {
    fallback: {
      events: path.resolve("./node_modules/events"),
      process: path.resolve("./node_modules/process"),
      zlib: path.resolve("./node_modules/browserify-zlib"),
      stream: path.resolve("./node_modules/stream-browserify"),
      util: path.resolve("./node_modules/util"),
      buffer: path.resolve("./node_modules/buffer"),
      asset: path.resolve("./node_modules/assert"),
    },
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
      "@material-ui/core": path.resolve("./node_modules/@material-ui/core"),
      "@material-ui/pickers": path.resolve(
        "./node_modules/@material-ui/pickers"
      ),
      "@forml/core": path.resolve("./node_modules/@forml/core"),
      "@forml/hooks": path.resolve("./node_modules/@forml/hooks"),
      "@forml/context": path.resolve("./node_modules/@forml/context"),
      "@forml/decorator-barebones": path.resolve(
        "./node_modules/@forml/decorator-barebones"
      ),
      "@forml/decorator-mui": path.resolve(
        "./node_modules/@forml/decorator-mui"
      ),
      "@forml/decorator-pdf": path.resolve(
        "./node_modules/@forml/decorator-pdf"
      ),
    },
    extensions: ["*", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
      { test: /\.(eot|svg|ttf|woff|woff2)$/, use: ["file-loader"] },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ],
};
