import type { TSESLint } from "@typescript-eslint/utils";
import noSingleLetterVariables from "./rules/no-single-letter-variables.js";

const plugin = {
  meta: {
    name: "eslint-plugin-ai-readable",
    version: "0.0.1",
  },
  rules: {
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
      "ai-readable/no-single-letter-variables": "warn",
    },
  },
});

export default plugin;
