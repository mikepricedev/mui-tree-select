import * as path from "path";
import { Configuration } from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { RuleSetUseItem } from "webpack";

const { name } = require("./package.json") as { name: string };

module.exports = (env): Configuration => {
  const mode = env?.NODE_ENV ?? "production";

  const isDev = mode !== "production";

  const contentBase = "./dist";

  const plugins: NonNullable<Configuration["plugins"]> = [
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: "./src/**/*.{ts,tsx,js,jsx}",
      },
    }),
  ];

  if (isDev) {
    plugins.unshift(
      new HtmlWebpackPlugin({
        title: "MUI Tree Select",
        template: require("html-webpack-template"),
        appMountId: "root",
        devServer: "http://localhost:8080",
      })
    );
  }
  return {
    entry: isDev ? "./src/index.dev.tsx" : "./src/index.tsx",
    devtool: isDev ? "inline-source-map" : "source-map",
    devServer: isDev ? { contentBase } : undefined,
    mode,
    output: {
      path: path.resolve(__dirname, contentBase),
      filename: "index.js",
      library: name,
      libraryTarget: "umd",
    },
    optimization: isDev
      ? undefined
      : {
          minimize: false,
        },
    externals: isDev
      ? undefined
      : [
          /^@material-ui\/.+$/,
          "react",
          "react-dom",
          /^react\/.+$/,
          /^react-dom\/.+$/,
        ],
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
    },
    plugins,
  };
};
