const { resolve } = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = () => {
  return {
    mode: 'production',
    entry: "./src/index.tsx",
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    context: resolve(__dirname, './'),
    module: {
      rules: [
        // {
        //     test: /\.jpe?g|png$/,
        //     exclude: /node_modules/,
        //     use: ["url-loader", "file-loader"]
        // },
        {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            loader: "ts-loader"
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        }
      ]
  },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
    ]
  }
};