import { readFileSync, readdirSync, statSync } from "node:fs";
import { pathToFileURL } from "node:url";

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

  const modules = [
    ...source.matchAll(/(?:\bfrom\s+|\bimport\s*(?:\(\s*)?)["']([^"']+)["']/g),
  ].map((match) => match[1]);

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
