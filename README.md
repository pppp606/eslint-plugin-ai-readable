# eslint-plugin-ai-readable

ESLint plugin for AI-readable code.

## Installation

```bash
npm install eslint-plugin-ai-readable --save-dev
```

## Usage

```js
// eslint.config.mjs
import aiReadable from "eslint-plugin-ai-readable";

export default [aiReadable.configs.recommended];
```

## Rules

| Rule                                                                                                       | Description                                                              |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [no-double-negative-identifiers](docs/rules/no-double-negative-identifiers.md)                             | Disallow double negative identifier names                                |
| [no-implicit-boolean-conversion-in-conditions](docs/rules/no-implicit-boolean-conversion-in-conditions.md) | Disallow implicit boolean conversions in conditional expressions          |
| [no-overloaded-flag-parameter](docs/rules/no-overloaded-flag-parameter.md)                                 | Disallow boolean literal arguments that reduce readability               |
| [no-single-letter-variables](docs/rules/no-single-letter-variables.md)                                     | Disallow single-letter variable names                                    |
| [require-named-intermediate-for-complex-condition](docs/rules/require-named-intermediate-for-complex-condition.md) | Require complex conditional expressions to be extracted into named variables |
