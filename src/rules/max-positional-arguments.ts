import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/pppp606/eslint-plugin-ai-readable/blob/main/docs/rules/${name}.md`,
);

type MessageIds = "maxPositionalArguments";
type Options = [
  {
    max?: number;
    ignoreFunctions?: string[];
  },
];

/**
 * Get the callee name as a string for matching against ignoreFunctions.
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

const maxPositionalArguments = createRule<Options, MessageIds>({
  name: "max-positional-arguments",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce a maximum number of positional arguments in function calls",
    },
    messages: {
      maxPositionalArguments:
        "Too many positional arguments ({{ count }}). Maximum allowed is {{ max }}. Use an options object instead for better readability.",
    },
    schema: [
      {
        type: "object",
        properties: {
          max: {
            type: "integer",
            minimum: 0,
          },
          ignoreFunctions: {
            type: "array",
            items: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context) {
    const options = context.options[0] || {};
    const max = options.max ?? 2;
    const ignoreFunctions = options.ignoreFunctions ?? [];

    function checkArguments(
      node: TSESTree.CallExpression | TSESTree.NewExpression,
    ): void {
      const calleeName = getCalleeName(node.callee);

      if (calleeName && ignoreFunctions.includes(calleeName)) {
        return;
      }

      const positionalArgs = node.arguments.filter(
        (arg) => arg.type !== "SpreadElement",
      );

      if (positionalArgs.length > max) {
        context.report({
          node,
          messageId: "maxPositionalArguments",
          data: {
            count: String(positionalArgs.length),
            max: String(max),
          },
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

export default maxPositionalArguments;
