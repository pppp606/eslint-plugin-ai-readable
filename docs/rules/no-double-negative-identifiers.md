# no-double-negative-identifiers

Disallow double negative identifier names for better readability.

Double negatives like `isNotDisabled` make code harder to understand for both humans and AI. Use positive names like `isEnabled` instead.

## Rule Details

This rule detects identifiers that contain two or more negation elements, such as:

- A negative prefix (`not`, `no`, `un`, `dis`, `in`, `im`, `non`, `cannot`) combined with a negative word (`disabled`, `invalid`, `inactive`, etc.)
- Two negative prefixes in sequence (e.g., `cannotUnregister`)

### Examples of **incorrect** code

```js
const isNotDisabled = true;
const hasNoUnavailable = false;
const cannotUnregister = true;
const isNonInvalid = true;

function isNotDisabled() {}

class Foo {
  isNotDisabled() {}
}

const obj = { isNotDisabled: true };
```

### Examples of **correct** code

```js
const isEnabled = true;
const hasPermission = true;
const canRegister = true;
const isNotReady = false; // Single negative is OK

function isEnabled() {}

class Foo {
  isEnabled() {}
}

const obj = { isEnabled: true };
```

## Options

This rule accepts an options object with the following properties:

### `negativeWords`

Type: `string[]`
Default: `[]`

Additional negative words to detect beyond the built-in list. These words are added to the default list.

Built-in negative words: `disabled`, `invalid`, `unknown`, `unavailable`, `inactive`, `unregistered`, `unauthorized`, `unregister`.

```json
{
  "ai-readable/no-double-negative-identifiers": [
    "warn",
    {
      "negativeWords": ["forbidden", "rejected"]
    }
  ]
}
```

### `allowList`

Type: `string[]`
Default: `[]`

Identifier names to exclude from this rule.

```json
{
  "ai-readable/no-double-negative-identifiers": [
    "warn",
    {
      "allowList": ["isNotDisabled"]
    }
  ]
}
```

### `checkProperties`

Type: `boolean`
Default: `true`

Whether to check object property names.

```json
{
  "ai-readable/no-double-negative-identifiers": [
    "warn",
    {
      "checkProperties": false
    }
  ]
}
```

## Detection Scope

This rule checks the following identifier types:

- **Variable declarations** (`const`, `let`, `var`) -- including arrow functions assigned to variables
- **Function declarations** (`function foo() {}`)
- **Named function expressions** (`const fn = function foo() {}`)
- **Method definitions** (`class Foo { bar() {} }`)
- **Object property names** (when `checkProperties` is enabled, which is the default)

The following are **not** checked by this rule:

- Function parameter names
- Class field / property declarations (TypeScript)
- Type aliases and interface names
- Enum members
- Import / export identifiers

## When Not To Use It

If your codebase has established conventions that use double negative names, or if you are working with external APIs that require specific naming patterns.
