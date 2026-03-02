import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/pppp606/eslint-plugin-ai-readable/blob/main/docs/rules/${name}.md`,
);

type MessageIds = "noImplicitBooleanConversion";
type Options = [
  {
    allowBooleanIdentifiers?: boolean;
    allowNullishCheck?: boolean;
  },
];

const BOOLEAN_PREFIX_PATTERN = /^(is|has|should|can|will|was|did)[A-Z]/;

const COMPARISON_OPERATORS = new Set([
  "===",
  "!==",
  "==",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "instanceof",
  "in",
]);

function isExplicitBoolean(
  node: TSESTree.Expression,
  allowBooleanIdentifiers: boolean,
): boolean {
  switch (node.type) {
    case "BinaryExpression":
      return COMPARISON_OPERATORS.has(node.operator);

    case "LogicalExpression":
      return (
        isExplicitBoolean(node.left, allowBooleanIdentifiers) &&
        isExplicitBoolean(node.right, allowBooleanIdentifiers)
      );

    case "UnaryExpression":
      if (node.operator === "!") {
        return isExplicitBoolean(
          node.argument as TSESTree.Expression,
          allowBooleanIdentifiers,
        );
      }
      return false;

    case "Literal":
      return typeof node.value === "boolean";

    case "Identifier":
      if (allowBooleanIdentifiers && BOOLEAN_PREFIX_PATTERN.test(node.name)) {
        return true;
      }
      return false;

    default:
      return false;
  }
}

/**
 * Collect all non-explicit leaf nodes from a LogicalExpression tree.
 * Instead of reporting the whole LogicalExpression, we report each
 * individual operand that is not explicitly boolean.
 */
function collectImplicitNodes(
  node: TSESTree.Expression,
  allowBooleanIdentifiers: boolean,
  results: TSESTree.Node[],
): void {
  if (node.type === "LogicalExpression") {
    collectImplicitNodes(node.left, allowBooleanIdentifiers, results);
    collectImplicitNodes(node.right, allowBooleanIdentifiers, results);
  } else {
    if (!isExplicitBoolean(node, allowBooleanIdentifiers)) {
      results.push(node);
    }
  }
}

const noImplicitBooleanConversionInConditions = createRule<
  Options,
  MessageIds
>({
  name: "no-implicit-boolean-conversion-in-conditions",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow implicit boolean conversions in conditional expressions",
    },
    messages: {
      noImplicitBooleanConversion:
        "Avoid implicit boolean conversion. Use an explicit comparison instead (e.g., value !== null, items.length > 0).",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowBooleanIdentifiers: {
            type: "boolean",
          },
          allowNullishCheck: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context) {
    const options = context.options[0] || {};
    const allowBooleanIdentifiers = options.allowBooleanIdentifiers ?? false;

    function checkCondition(test: TSESTree.Expression): void {
      if (test.type === "LogicalExpression") {
        const implicitNodes: TSESTree.Node[] = [];
        collectImplicitNodes(test, allowBooleanIdentifiers, implicitNodes);
        for (const node of implicitNodes) {
          context.report({
            node,
            messageId: "noImplicitBooleanConversion",
          });
        }
      } else {
        if (!isExplicitBoolean(test, allowBooleanIdentifiers)) {
          context.report({
            node: test,
            messageId: "noImplicitBooleanConversion",
          });
        }
      }
    }

    return {
      IfStatement(node) {
        checkCondition(node.test);
      },
      WhileStatement(node) {
        checkCondition(node.test);
      },
      DoWhileStatement(node) {
        checkCondition(node.test);
      },
      ForStatement(node) {
        if (node.test) {
          checkCondition(node.test);
        }
      },
      ConditionalExpression(node) {
        checkCondition(node.test);
      },
    };
  },
});

export default noImplicitBooleanConversionInConditions;
