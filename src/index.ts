import type { TSESLint } from "@typescript-eslint/utils";
import noDoubleNegativeIdentifiers from "./rules/no-double-negative-identifiers.js";
import noSingleLetterVariables from "./rules/no-single-letter-variables.js";

const plugin = {
  meta: {
    name: "eslint-plugin-ai-readable",
    version: "0.0.1",
  },
  rules: {
    "no-double-negative-identifiers": noDoubleNegativeIdentifiers,
    "no-single-letter-variables": noSingleLetterVariables,
  },
  configs: {} as Record<string, TSESLint.FlatConfig.Config>,
};

Object.assign(plugin.configs, {
  recommended: {
    plugins: {
      "ai-readable": plugin,
    },
    rules: {
      "ai-readable/no-double-negative-identifiers": "warn",
      "ai-readable/no-single-letter-variables": "warn",
    },
  },
});

export default plugin;
