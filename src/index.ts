import type { TSESLint } from "@typescript-eslint/utils";
import noDoubleNegativeIdentifiers from "./rules/no-double-negative-identifiers.js";
import noOverloadedFlagParameter from "./rules/no-overloaded-flag-parameter.js";
import noImplicitBooleanConversionInConditions from "./rules/no-implicit-boolean-conversion-in-conditions.js";
import requireNamedIntermediateForComplexCondition from "./rules/require-named-intermediate-for-complex-condition.js";
import noSingleLetterVariables from "./rules/no-single-letter-variables.js";

const plugin = {
  meta: {
    name: "eslint-plugin-ai-readable",
    version: "0.0.1",
  },
  rules: {
    "no-double-negative-identifiers": noDoubleNegativeIdentifiers,
    "no-implicit-boolean-conversion-in-conditions":
      noImplicitBooleanConversionInConditions,
    "no-overloaded-flag-parameter": noOverloadedFlagParameter,
    "no-single-letter-variables": noSingleLetterVariables,
    "require-named-intermediate-for-complex-condition":
      requireNamedIntermediateForComplexCondition,
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
      "ai-readable/no-implicit-boolean-conversion-in-conditions": "warn",
      "ai-readable/no-overloaded-flag-parameter": "warn",
      "ai-readable/no-single-letter-variables": "warn",
      "ai-readable/require-named-intermediate-for-complex-condition": "warn",
    },
  },
});

export default plugin;
