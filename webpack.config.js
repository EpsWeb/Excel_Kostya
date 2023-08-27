const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

const filename = (ext) => (isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`);

const jsLoaders = () => {
  const loaders = [
    {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  ];

  if (isDev) {
    loaders.push("eslint-loader");
  }
  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    hot: isDev,
    port: 3000,
  },
  devtool: isDev ? "source-map" : false,
  entry: ["@babel/polyfill", "./index.js"],
  mode: "development",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "favicon.ico"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@core": path.resolve(__dirname, "src", "core"),
    },
    extensions: [".js"],
  },
};
