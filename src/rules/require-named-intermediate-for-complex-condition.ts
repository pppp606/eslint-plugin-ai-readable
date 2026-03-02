import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/pppp606/eslint-plugin-ai-readable/blob/main/docs/rules/${name}.md`,
);

type MessageIds = "tooManyOperators" | "tooDeep";
type Options = [
  {
    maxOperators?: number;
    maxDepth?: number;
  },
];

/**
 * Count all logical operators (&&, ||, ??, !) in an expression tree.
 * Only recurses into LogicalExpression and UnaryExpression with '!' operator.
 */
function countOperators(node: TSESTree.Expression): number {
  if (node.type === "LogicalExpression") {
    return 1 + countOperators(node.left) + countOperators(node.right);
  }
  if (node.type === "UnaryExpression" && node.operator === "!") {
    return 1 + countOperators(node.argument);
  }
  return 0;
}

/**
 * Calculate the maximum nesting depth of LogicalExpression nodes (&&, ||, ??).
 * A single LogicalExpression (or chain of same-operator LogicalExpressions) is depth 1.
 * Depth only increases when a child LogicalExpression has a different operator
 * than its parent, representing true nesting rather than simple chaining.
 */
function calcDepth(
  node: TSESTree.Expression,
  parentOperator?: string,
): number {
  if (node.type === "LogicalExpression") {
    const increment = parentOperator === node.operator ? 0 : 1;
    return (
      increment +
      Math.max(
        calcDepth(node.left, node.operator),
        calcDepth(node.right, node.operator),
      )
    );
  }
  if (node.type === "UnaryExpression" && node.operator === "!") {
    return calcDepth(node.argument, parentOperator);
  }
  return 0;
}

const requireNamedIntermediateForComplexCondition = createRule<
  Options,
  MessageIds
>({
  name: "require-named-intermediate-for-complex-condition",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require named intermediates for complex conditional expressions to improve readability",
    },
    messages: {
      tooManyOperators:
        "Complex condition has {{ count }} logical operators (max {{ max }}). Extract into a named intermediate variable for better readability.",
      tooDeep:
        "Complex condition has nesting depth {{ depth }} (max {{ max }}). Extract into a named intermediate variable for better readability.",
    },
    schema: [
      {
        type: "object",
        properties: {
          maxOperators: {
            type: "integer",
            minimum: 0,
          },
          maxDepth: {
            type: "integer",
            minimum: 0,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context) {
    const options = context.options[0] || {};
    const maxOperators = options.maxOperators ?? 2;
    const maxDepth = options.maxDepth ?? 2;

    function checkCondition(test: TSESTree.Expression): void {
      const operatorCount = countOperators(test);
      const depth = calcDepth(test);

      if (operatorCount > maxOperators) {
        context.report({
          node: test,
          messageId: "tooManyOperators",
          data: {
            count: String(operatorCount),
            max: String(maxOperators),
          },
        });
      }

      if (depth > maxDepth) {
        context.report({
          node: test,
          messageId: "tooDeep",
          data: {
            depth: String(depth),
            max: String(maxDepth),
          },
        });
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

export default requireNamedIntermediateForComplexCondition;
