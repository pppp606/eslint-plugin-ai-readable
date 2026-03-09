# eslint-plugin-ai-readable

ESLint plugin for AI-readable code.

## Installation

```bash
npm install eslint-plugin-ai-readable --save-dev
```

### Prerequisites

This plugin is designed for TypeScript projects. You need:

- [TypeScript](https://www.typescriptlang.org/) `>= 5.0`
- [`@typescript-eslint/parser`](https://typescript-eslint.io/packages/parser/) `>= 8.0`

## Usage

```js
// eslint.config.mjs
import tseslint from "typescript-eslint";
import aiReadable from "eslint-plugin-ai-readable";

export default tseslint.config(
  ...tseslint.configs.recommended,
  aiReadable.configs.recommended,
);
```

You can also enable rules individually:

```js
// eslint.config.mjs
import aiReadable from "eslint-plugin-ai-readable";

export default [
  {
    plugins: {
      "ai-readable": aiReadable,
    },
    rules: {
      "ai-readable/no-double-negative-identifiers": "error",
    },
  },
];
```

## Rules

| Rule                                                                                                               | Description                                                        |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| [max-positional-arguments](docs/rules/max-positional-arguments.md)                                                 | Enforce a maximum number of positional arguments in function calls |
| [no-double-negative-identifiers](docs/rules/no-double-negative-identifiers.md)                                     | Disallow double negative identifiers                               |
| [no-overloaded-flag-parameter](docs/rules/no-overloaded-flag-parameter.md)                                         | Disallow boolean literal arguments that reduce readability         |
| [no-single-letter-variables](docs/rules/no-single-letter-variables.md)                                             | Disallow single-letter variable names                              |
| [require-named-intermediate-for-complex-condition](docs/rules/require-named-intermediate-for-complex-condition.md) | Require extracting complex conditions into named variables         |

## Recommended Companion Rules

For the best AI-readable code, we recommend enabling these rules from [`@typescript-eslint`](https://typescript-eslint.io/):

| Rule | Description |
| ---- | ----------- |
| [`@typescript-eslint/strict-boolean-expressions`](https://typescript-eslint.io/rules/strict-boolean-expressions/) | Disallow implicit boolean coercions in conditions. Requires type information. |

`strict-boolean-expressions` ensures that conditions only use actual booleans, preventing implicit type coercion that makes code harder for AI to analyze. This rule requires [typed linting](https://typescript-eslint.io/getting-started/typed-linting/) to be configured.
