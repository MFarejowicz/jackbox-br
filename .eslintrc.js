module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["plugin:react/recommended", "airbnb"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "import/no-unresolved": "off",
    "react/destructuring-assignment": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/require-default-props": "off",
    "arrow-body-style": "off",
    "comma-dangle": "off",
    "max-classes-per-file": "off",
    "no-param-reassign": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "operator-linebreak": "off",
    quotes: ["error", "double"],
  },
};
