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

export function findBoundaryViolations(source, path) {
  if (!path.replaceAll("\\", "/").startsWith("packages/domain/")) return [];

  const sourceFile = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const modules = [];
  const addModule = (node) => {
    if (node && ts.isStringLiteralLike(node)) modules.push(node.text);
  };

  const visit = (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      addModule(node.moduleSpecifier);
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
      modules.filter((name) =>
        forbidden.some((item) => name === item || name.startsWith(item)),
      ),
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
  const failures = sourceFiles(process.argv[2]).flatMap((path) =>
    findBoundaryViolations(readFileSync(path, "utf8"), path).map(
      (module) => `${path}: ${module}`,
    ),
  );

  if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  }
}
