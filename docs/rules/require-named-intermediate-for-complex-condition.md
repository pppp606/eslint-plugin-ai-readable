# require-named-intermediate-for-complex-condition

Require complex conditional expressions to be extracted into named intermediate variables.

When a condition uses many logical operators or deeply nested sub-expressions, it becomes hard for both humans and AI to understand at a glance. Extracting the condition into a well-named variable communicates the intent clearly.

## Rule Details

This rule reports conditions that exceed the allowed number of logical operators (`&&`, `||`, `??`, `!`) or exceed the allowed nesting depth of logical expressions.

### Examples of **incorrect** code

```js
// Too many operators (default max: 2)
if ((a && b) || (c && d)) {
}

if ((a && b) || (!c && d) || e) {
}

while ((a && b) || (c && d)) {}

const x = (a && b) || (c && d) ? 1 : 0;

// Too deep nesting (default max: 2)
if (a && (b || (c && d))) {
}
```

### Examples of **correct** code

```js
// Simple conditions within limits
if (a && b) {
}

if ((a && b) || c) {
}

// Complex conditions extracted into named intermediates
const canProceed = (a && b) || (!c && d) || e;
if (canProceed) {
}

const isValid = (a && b) || (c && d);
while (isValid) {}

const shouldContinue = (a && b) || (c && d);
for (; shouldContinue; ) {}
```

## Options

This rule accepts an options object with the following properties:

### `maxOperators`

Type: `integer`
Default: `2`

Maximum number of logical operators (`&&`, `||`, `??`, `!`) allowed in a single condition expression before reporting.

```json
{
  "ai-readable/require-named-intermediate-for-complex-condition": [
    "warn",
    {
      "maxOperators": 3
    }
  ]
}
```

### `maxDepth`

Type: `integer`
Default: `2`

Maximum nesting depth of logical expressions. Chains of the same operator (e.g., `a && b && c`) count as depth 1. Depth increases when a different operator is nested inside (e.g., `a && (b || c)` is depth 2).

```json
{
  "ai-readable/require-named-intermediate-for-complex-condition": [
    "warn",
    {
      "maxDepth": 3
    }
  ]
}
```

## Detection Scope

This rule checks conditions in the following statement types:

- **if statements** (`if (condition) {}`)
- **while statements** (`while (condition) {}`)
- **do-while statements** (`do {} while (condition);`)
- **for statements** (`for (; condition;) {}`)
- **conditional (ternary) expressions** (`condition ? a : b`)

The following are **not** reported by this rule:

- Conditions already extracted into named intermediate variables
- Simple conditions within the operator count and depth limits
- Logical expressions outside of condition contexts (e.g., variable assignments)

## When Not To Use It

If your codebase uses complex inline conditions by convention and you prefer conciseness, or if you are working with well-known boolean patterns that are self-explanatory in context.
