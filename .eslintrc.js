module.exports = {
  env: { es2020: true, browser: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    jsx: true,
    useJSXTextNode: true,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    project: "./tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["/node_modules/**/*", "/dist/**/*"],
};
