const { promises: fs, existsSync } = require("fs");
const { parse } = require("path");
const path = require("path");
const ts = require("typescript");

const {
  name,
  version,
  peerDependencies,
  devDependencies,
} = require("../package.json");
const { compilerOptions } = require("../tsconfig.json");

const SRC_DIR = path.resolve(__dirname, "../src");

(async () => {
  const promises = [
    fs.writeFile(
      path.resolve(__dirname, "../example/package.json"),
      JSON.stringify(
        {
          name: `${name}-example`,
          dependencies: {
            ...peerDependencies,
            "mui-tree-select": `${version}`,
            "@emotion/react": devDependencies["@emotion/react"],
            "@emotion/styled": devDependencies["@emotion/styled"],
            "@mui/icons-material": devDependencies["@mui/icons-material"],
            "@mui/material": devDependencies["@mui/material"],
            react: devDependencies.react,
            "react-dom": devDependencies["react-dom"],
          },
          description: "MUI Tree Select Example",
          devDependencies: {
            "react-scripts": "latest",
          },
          title: "MUI Tree Select Example",
        },
        null,
        2
      ),
      {
        flag: "w+",
      }
    ),
  ];

  // Encode and/or copy all sample files.
  for (const dirs = ["example"]; dirs.length > 0; ) {
    const relDirPath = dirs.pop();
    const fullDirPath = path.resolve(SRC_DIR, relDirPath);

    const lsResults = await fs.readdir(fullDirPath, {
      encoding: "utf-8",
      withFileTypes: true,
    });

    for (const result of lsResults) {
      const name = result.name;
      const relResultPath = path.join(relDirPath, name);
      const fullResultPath = path.resolve(fullDirPath, name);

      if (result.isDirectory()) {
        dirs.push(relResultPath);
      } else if (result.isFile()) {
        promises.push(
          fs
            .readFile(fullResultPath, {
              encoding: "utf-8",
            })
            .then(async (content) => {
              const isTS = /\.tsx?$/.test(result.name);

              const newPath = path.resolve(
                __dirname,
                "..",
                isTS
                  ? path.format(
                      (() => {
                        const parsed = path.parse(relResultPath);

                        return {
                          ...parsed,
                          base: `${parsed.name}.js`,
                          ext: ".js",
                        };
                      })()
                    )
                  : relResultPath
              );
              const newDir = path.parse(newPath).dir;

              if (!existsSync()) {
                await fs.mkdir(newDir, { recursive: true });
              }

              return fs.writeFile(
                newPath,
                isTS
                  ? ts.transpileModule(content, {
                      compilerOptions: {
                        ...compilerOptions,
                        jsx: "preserve",
                        target: "ES2019",
                        module: "ES6",
                      },
                    }).outputText
                  : content,
                {
                  flag: "w+",
                }
              );
            })
        );
      }
    }
  }

  await Promise.all(promises);
})();
