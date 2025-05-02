
export default [
  {
    ignores: ["dist"]
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        document: "readonly",
        navigator: "readonly",
        window: "readonly",
      },
    },
    plugins: {
      "react-hooks": {
        rules: {
          "react-hooks/rules-of-hooks": "error",
          "react-hooks/exhaustive-deps": "warn",
        }
      },
      "react-refresh": {
        rules: {
          "react-refresh/only-export-components": [
            "warn",
            { allowConstantExport: true },
          ],
        }
      },
    },
    rules: {
      "no-unused-vars": "off",
    },
  }
];