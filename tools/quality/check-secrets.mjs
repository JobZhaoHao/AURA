import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const rules = [
  ["private-key", /-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----/g],
  [
    "credential-assignment",
    /(?:SECRET|TOKEN|API_KEY|PRIVATE_KEY)[A-Z0-9_]*\s*[:=]\s*["']?([A-Za-z0-9_+/=.-]{16,})/gi,
  ],
];

export function scanText(text, path) {
  return rules.flatMap(([rule, pattern]) =>
    [...text.matchAll(pattern)].map(() => ({
      path,
      rule,
      sample: "[REDACTED]",
    })),
  );
}

export function scanFiles(paths) {
  return paths.flatMap((path) => {
    const buffer = readFileSync(path);
    return buffer.includes(0) ? [] : scanText(buffer.toString("utf8"), path);
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const files = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], {
    encoding: "utf8",
  })
    .split(/\r?\n/)
    .filter(Boolean);
  const findings = scanFiles(files);

  findings.forEach(({ path, rule, sample }) =>
    console.error(`${path}: ${rule}: ${sample}`),
  );
  if (findings.length) process.exitCode = 1;
}
