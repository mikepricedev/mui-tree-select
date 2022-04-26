import * as path from "path";
import { Configuration, WebpackOptionsNormalized } from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { RuleSetUseItem } from "webpack";

const config = (
  env
): Configuration & Pick<WebpackOptionsNormalized, "devServer"> => {
  if (env?.NODE_ENV === "production") {
    throw new Error("Webpack is only used here for Development.");
  }

  return {
    entry: "./src/example/index.tsx",
    devtool: "inline-source-map",
    devServer: { static: "./dist" },
    mode: "development",
    name: "example",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: (() => {
            const use: RuleSetUseItem[] = [
              {
                loader: "ts-loader",
                options: {
                  // disable type checker - we will use it in fork plugin
                  transpileOnly: true,
                },
              },
            ];

            return use;
          })(),
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "mui-tree-select": path.resolve(__dirname, "./src/index"),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "MUI Tree Select",
        template: path.resolve(__dirname, "./src/example/index.html"),
      }),
      new ForkTsCheckerWebpackPlugin({}),
    ],
  };
};

export default config;
