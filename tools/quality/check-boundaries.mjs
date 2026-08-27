import { readFileSync, readdirSync, statSync } from "node:fs";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const forbidden = [
  "cc",
  "wechat",
  "wx-server-sdk",
  "@cloudbase/",
  "openai",
  "@anthropic-ai/",
];

const forbiddenGameClientRuntime = ["@aura/contracts", "zod"];

function matchesForbiddenModule(name, forbiddenName) {
  return (
    name === forbiddenName ||
    name.startsWith(
      forbiddenName.endsWith("/") ? forbiddenName : `${forbiddenName}/`,
    )
  );
}

function isTypeOnlyImport(node) {
  const clause = node.importClause;
  if (!clause) return false;
  if (clause.isTypeOnly) return true;
  if (clause.name || !ts.isNamedImports(clause.namedBindings)) return false;
  return clause.namedBindings.elements.every((element) => element.isTypeOnly);
}

export function findBoundaryViolations(source, path) {
  const normalizedPath = path.replaceAll("\\", "/");
  const isDomain = normalizedPath.startsWith("packages/domain/");
  const isGameClient = normalizedPath.startsWith(
    "apps/game-client/assets/scripts/",
  );
  if (!isDomain && !isGameClient) return [];

  const sourceFile = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const modules = [];
  const addModule = (node, typeOnly = false) => {
    if (node && ts.isStringLiteralLike(node)) {
      modules.push({ name: node.text, typeOnly });
    }
  };

  const visit = (node) => {
    if (ts.isImportDeclaration(node)) {
      addModule(node.moduleSpecifier, isTypeOnlyImport(node));
    } else if (ts.isExportDeclaration(node)) {
      addModule(node.moduleSpecifier, node.isTypeOnly);
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      addModule(node.moduleReference.expression);
    } else if (ts.isCallExpression(node)) {
      const [argument] = node.arguments;
      if (
        node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === "require")
      ) {
        addModule(argument);
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return [
    ...new Set(
      modules
        .filter((name) =>
          (isDomain ? forbidden : forbiddenGameClientRuntime).some(
            (item) =>
              (!isGameClient || !name.typeOnly) &&
              matchesForbiddenModule(name.name, item),
          ),
        )
        .map(({ name }) => name),
    ),
  ];
}

function sourceFiles(path) {
  return statSync(path).isDirectory()
    ? readdirSync(path).flatMap((name) => sourceFiles(`${path}/${name}`))
    : /\.[cm]?tsx?$/.test(path)
      ? [path]
      : [];
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const failures = process.argv
    .slice(2)
    .flatMap((root) =>
      sourceFiles(root).flatMap((path) =>
        findBoundaryViolations(readFileSync(path, "utf8"), path).map(
          (module) => `${path}: ${module}`,
        ),
      ),
    );

  if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  }
}
