import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/pppp606/eslint-plugin-ai-readable/blob/main/docs/rules/${name}.md`,
);

type MessageIds = "noOverloadedFlagParameter";
type Options = [
  {
    maxAllowedBooleanArgs?: number;
    ignorePattern?: string;
  },
];

/**
 * Get the callee name as a string for pattern matching.
 * Handles simple identifiers (fn), member expressions (obj.fn), and chained calls (a.b.c).
 */
function getCalleeName(node: TSESTree.Expression): string | null {
  if (node.type === "Identifier") {
    return node.name;
  }
  if (
    node.type === "MemberExpression" &&
    !node.computed &&
    node.property.type === "Identifier"
  ) {
    const objectName = getCalleeName(node.object);
    if (objectName) {
      return `${objectName}.${node.property.name}`;
    }
  }
  return null;
}

const noOverloadedFlagParameter = createRule<Options, MessageIds>({
  name: "no-overloaded-flag-parameter",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow boolean literal arguments that reduce readability",
    },
    messages: {
      noOverloadedFlagParameter:
        "Avoid passing boolean literal '{{ value }}' as an argument. Use an options object instead for better readability (e.g., { flagName: {{ value }} }).",
    },
    schema: [
      {
        type: "object",
        properties: {
          maxAllowedBooleanArgs: {
            type: "integer",
            minimum: 0,
          },
          ignorePattern: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context) {
    const options = context.options[0] || {};
    const maxAllowedBooleanArgs = options.maxAllowedBooleanArgs ?? 0;
    let ignorePattern: RegExp | null = null;
    if (options.ignorePattern) {
      try {
        ignorePattern = new RegExp(options.ignorePattern);
      } catch {
        // Invalid regex pattern is silently ignored
      }
    }

    function checkArguments(
      node: TSESTree.CallExpression | TSESTree.NewExpression,
    ): void {
      const calleeName = getCalleeName(node.callee);

      if (calleeName && ignorePattern && ignorePattern.test(calleeName)) {
        return;
      }

      const booleanArgs = node.arguments.filter(
        (arg): arg is TSESTree.BooleanLiteral =>
          arg.type === "Literal" && typeof arg.value === "boolean",
      );

      if (booleanArgs.length <= maxAllowedBooleanArgs) {
        return;
      }

      for (const arg of booleanArgs) {
        context.report({
          node: arg,
          messageId: "noOverloadedFlagParameter",
          data: { value: String(arg.value) },
        });
      }
    }

    return {
      CallExpression(node) {
        checkArguments(node);
      },
      NewExpression(node) {
        checkArguments(node);
      },
    };
  },
});

export default noOverloadedFlagParameter;
