import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const forbiddenGameClientRuntime = ["@aura/contracts", "zod"];
const domainRoot = resolve("packages/domain");
const domainSourceRoot = resolve("packages/domain/src");
const gameClientSourceRoot = resolve("apps/game-client/assets/scripts");

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

function remainsInside(root, target) {
  const fromRoot = relative(root, target);
  return (
    fromRoot === "" ||
    (!isAbsolute(fromRoot) &&
      fromRoot !== ".." &&
      !fromRoot.startsWith(`..${sep}`))
  );
}

function isAllowedDomainSpecifier(name, importer) {
  if (name === "@aura/contracts" || name === "@aura/content") return true;
  if (!name.startsWith("./") && !name.startsWith("../")) return false;

  return remainsInside(
    domainSourceRoot,
    resolve(dirname(resolve(importer)), name),
  );
}

export function findBoundaryViolations(source, importer) {
  const resolvedImporter = resolve(importer);
  const isDomain = remainsInside(domainRoot, resolvedImporter);
  const isGameClient = remainsInside(gameClientSourceRoot, resolvedImporter);
  if (!isDomain && !isGameClient) return [];

  const sourceFile = ts.createSourceFile(
    importer,
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const modules = [];
  const addModule = (node, typeOnly = false, dynamicKind) => {
    if (node && ts.isStringLiteralLike(node)) {
      modules.push({ name: node.text, typeOnly });
    } else if (dynamicKind !== undefined) {
      modules.push({
        name: `<non-literal ${dynamicKind}>`,
        typeOnly: false,
        unconditional: true,
      });
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
        addModule(
          argument,
          false,
          node.expression.kind === ts.SyntaxKind.ImportKeyword
            ? "import"
            : "require",
        );
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return [
    ...new Set(
      modules
        .filter((module) => {
          if (module.unconditional) return true;
          if (isDomain) {
            return !isAllowedDomainSpecifier(module.name, resolvedImporter);
          }
          return forbiddenGameClientRuntime.some(
            (item) =>
              !module.typeOnly && matchesForbiddenModule(module.name, item),
          );
        })
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
