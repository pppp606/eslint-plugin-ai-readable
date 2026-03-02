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

export default [
  aiReadable.configs.recommended,
];
```

## Rules

| Rule | Description |
| --- | --- |
| [no-single-letter-variables](docs/rules/no-single-letter-variables.md) | Disallow single-letter variable names |
| [no-double-negative-identifiers](docs/rules/no-double-negative-identifiers.md) | Disallow double negative identifier names |
| [no-overloaded-flag-parameter](docs/rules/no-overloaded-flag-parameter.md) | Disallow boolean literal arguments that reduce readability |
