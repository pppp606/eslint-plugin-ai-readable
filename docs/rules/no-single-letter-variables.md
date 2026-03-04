# no-single-letter-variables

Disallow single-letter variable names for better readability.

Single-letter names like `x`, `n`, or `a` provide no semantic meaning, making code harder to understand for both humans and AI. Use descriptive names like `count`, `name`, or `index` instead.

## Rule Details

This rule detects variable declarations where the bound identifier is exactly one character long. It handles plain declarations as well as destructuring patterns (object and array).

### Examples of **incorrect** code

```js
const x = 1;
let y = getValue();

// Typed variables (TypeScript)
const x: number = 1;
let y: string = "hello";

// Object destructuring
const { x } = obj;
const { name: n } = obj;

// Array destructuring
const [x] = arr;
const [a, b] = arr;
```

### Examples of **correct** code

```js
const count = 1;
let result = getValue();

// Typed variables (TypeScript)
const count: number = 1;
let result: string = "hello";

// Object destructuring
const { name } = obj;
const { name: fullName } = obj;

// Array destructuring
const [item] = arr;
```

## Options

This rule has no options.

## Detection Scope

This rule checks the following identifier types:

- **Variable declarations** (`const`, `let`, `var`) -- including plain identifiers, object destructuring patterns, and array destructuring patterns

The following are **not** checked by this rule:

- Function parameter names
- Function declarations and function expression names
- Class names and method definitions
- Object property names (keys)
- Import / export identifiers
- Type aliases and interface names
- Rest element patterns in destructuring (`...rest`)

## When Not To Use It

If your codebase uses single-letter variables by convention in certain contexts, such as mathematical formulas, loop counters (`i`, `j`, `k`), or coordinate variables (`x`, `y`, `z`).

This rule has no `allow` option, so if you want to permit single-letter variables in specific files or directories, disable the rule individually in your ESLint configuration instead of using `recommended`.
