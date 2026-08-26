import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const rules = [
  ["private-key", /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g],
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

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const files = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], {
    encoding: "utf8",
  })
    .split(/\r?\n/)
    .filter(
      (path) =>
        path && /\.(?:[cm]?[jt]sx?|json|ya?ml|toml|env|md)$/i.test(path),
    );
  const findings = files.flatMap((path) =>
    scanText(readFileSync(path, "utf8"), path),
  );

  findings.forEach(({ path, rule, sample }) =>
    console.error(`${path}: ${rule}: ${sample}`),
  );
  if (findings.length) process.exitCode = 1;
}
