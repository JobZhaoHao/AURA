import js from "@eslint/js";
import tseslint from "typescript-eslint";

const restrictedDomainGlobals = [
  "console",
  "process",
  "window",
  "document",
  "fetch",
  "localStorage",
  "globalThis",
  "global",
  "crypto",
  "performance",
  "XMLHttpRequest",
  "WebSocket",
  "navigator",
  "location",
  "require",
  "Date",
];

const restrictedProductionDomainGlobals = [
  ...restrictedDomainGlobals,
  "eval",
  "Function",
  "setTimeout",
  "setInterval",
  "Reflect",
];

const safeMathConstants = new Set([
  "E",
  "LN10",
  "LN2",
  "LOG10E",
  "LOG2E",
  "PI",
  "SQRT1_2",
  "SQRT2",
]);

const safeMathFunctions = new Set([
  "abs",
  "acos",
  "acosh",
  "asin",
  "asinh",
  "atan",
  "atan2",
  "atanh",
  "cbrt",
  "ceil",
  "clz32",
  "cos",
  "cosh",
  "exp",
  "expm1",
  "floor",
  "fround",
  "hypot",
  "imul",
  "log",
  "log10",
  "log1p",
  "log2",
  "max",
  "min",
  "pow",
  "round",
  "sign",
  "sin",
  "sinh",
  "sqrt",
  "tan",
  "tanh",
  "trunc",
]);

const numericMathConstantOperators = new Set(["-", "*", "/", "%", "**"]);

function directExpressionUsage(node) {
  let expression = node;
  while (expression.parent?.type === "ChainExpression") {
    expression = expression.parent;
  }
  return { expression, parent: expression.parent };
}

function isDirectMathFunctionCall(node) {
  const { expression, parent } = directExpressionUsage(node);
  return parent?.type === "CallExpression" && parent.callee === expression;
}

function isDirectMathConstantOperation(node) {
  const { expression, parent } = directExpressionUsage(node);
  if (parent?.type === "UnaryExpression") {
    return (
      parent.argument === expression &&
      (parent.operator === "+" || parent.operator === "-")
    );
  }
  return (
    parent?.type === "BinaryExpression" &&
    numericMathConstantOperators.has(parent.operator) &&
    (parent.left === expression || parent.right === expression)
  );
}

const domainCapabilityPlugin = {
  meta: {
    name: "aura-domain-capabilities",
  },
  rules: {
    "no-reflection-trampoline": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          forbiddenProperty:
            "Domain code must not use constructor and prototype trampolines; '{{property}}' access is forbidden.",
        },
      },
      create(context) {
        return {
          MemberExpression(node) {
            const propertyName = node.computed
              ? node.property.type === "Literal" &&
                typeof node.property.value === "string"
                ? node.property.value
                : undefined
              : node.property.type === "Identifier"
                ? node.property.name
                : undefined;
            if (
              propertyName !== "constructor" &&
              propertyName !== "__proto__"
            ) {
              return;
            }
            context.report({
              node,
              messageId: "forbiddenProperty",
              data: { property: propertyName },
            });
          },
        };
      },
    },
    "safe-math-member": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          unsafeMember:
            "Domain code may access only safe numeric Math members; '{{member}}' is not allowed.",
          unsafeFunctionUse:
            "Safe Math function '{{member}}' must be used directly as a call callee; extraction and reflection are not allowed.",
          unsafeConstantUse:
            "Safe Math constant '{{member}}' must be used directly in a numeric operation; extraction and reflection are not allowed.",
        },
      },
      create(context) {
        return {
          MemberExpression(node) {
            if (
              node.object.type !== "Identifier" ||
              node.object.name !== "Math"
            ) {
              return;
            }

            const memberName = node.computed
              ? node.property.type === "Literal" &&
                typeof node.property.value === "string"
                ? node.property.value
                : undefined
              : node.property.type === "Identifier"
                ? node.property.name
                : undefined;

            if (memberName !== undefined) {
              if (safeMathFunctions.has(memberName)) {
                if (isDirectMathFunctionCall(node)) return;
                context.report({
                  node,
                  messageId: "unsafeFunctionUse",
                  data: { member: memberName },
                });
                return;
              }

              if (safeMathConstants.has(memberName)) {
                if (isDirectMathConstantOperation(node)) return;
                context.report({
                  node,
                  messageId: "unsafeConstantUse",
                  data: { member: memberName },
                });
                return;
              }
            }

            context.report({
              node,
              messageId: "unsafeMember",
              data: {
                member: memberName ?? "non-literal computed member",
              },
            });
          },
        };
      },
    },
  },
};

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/temp/**",
      ".superpowers/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,cjs,mjs,ts,tsx}"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
  {
    files: ["packages/domain/**/*.{ts,tsx,cts,mts}"],
    linterOptions: {
      noInlineConfig: true,
    },
    plugins: {
      "aura-domain": domainCapabilityPlugin,
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: ["cc", "wechat", "wx-server-sdk", "openai"],
          patterns: ["@cloudbase/*", "@anthropic-ai/*"],
        },
      ],
      "no-restricted-globals": ["error", ...restrictedDomainGlobals],
      "aura-domain/safe-math-member": "error",
      "no-restricted-properties": [
        "error",
        {
          object: "Math",
          property: "random",
          message:
            "Domain randomness must use the deterministic random module.",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Identifier[name='Math']:not(MemberExpression[object.name='Math'] > Identifier[name='Math'])",
          message:
            "Domain code must access Math through a direct property; the Math object must not be aliased or passed.",
        },
      ],
    },
  },
  {
    files: ["packages/domain/src/**/*.{ts,tsx,cts,mts}"],
    rules: {
      "no-restricted-globals": ["error", ...restrictedProductionDomainGlobals],
      "aura-domain/no-reflection-trampoline": "error",
    },
  },
  {
    files: ["packages/domain/test/history.test.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        ...restrictedDomainGlobals.filter((name) => name !== "global"),
      ],
    },
  },
);
