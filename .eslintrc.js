"use strict";

module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  plugins: ["import", "unused-imports"],
  rules: {
    "import/order": [
      "warn",
      {
        groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      { args: "after-used", argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
};
