const path = require("path");
const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const autoprefixer = require("autoprefixer");

const target = process.env.NODE_ENV === "production" ? "browserslist" : "web";
const mode = process.env.NODE_ENV === "production" ? "production" : "development";

function getFilesFromDirectory(directory, extension) {
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(extension))
    .map((file) => path.resolve(directory, file));
}

module.exports = {
  mode,
  entry: {
    bundle: [...getFilesFromDirectory("./scripts", ".js"), ...getFilesFromDirectory("./styles", ".scss")]
  },
  output: {
    path: path.resolve(__dirname),
    filename: "giraflor_sale.js"
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  ["postcss-preset-env"],
                  autoprefixer({
                    overrideBrowserslist: ["iOS >= 10", "Safari >= 10", "last 2 versions"]
                  })
                ]
              }
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]"
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "giraflor_sale.css"
    })
  ],
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })]
  },
  target
};
