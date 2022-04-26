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
    entry: "./src/index.dev.tsx",
    devtool: "inline-source-map",
    devServer: { static: "./dist" },
    mode: "development",
    name: "main",
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
    plugins: [
      new HtmlWebpackPlugin({
        title: "MUI Tree Select",
        templateContent: `
          <html>
            <body>
              <div id="root"></div>
            </body>
          </html>
      `,
      }),
      new ForkTsCheckerWebpackPlugin({}),
    ],
  };
};

export default config;
