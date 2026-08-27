# Task 4: Environment Isolation Contracts

## Status

Implementation and verification are complete. The final commit is recorded
below.

## Files changed

- `.env.example`
- `apps/cloud-functions/package.json`
- `apps/cloud-functions/tsconfig.json`
- `apps/cloud-functions/src/config/server-config.ts`
- `apps/cloud-functions/test/server-config.test.ts`
- `config/environments/development.example.json`
- `config/environments/test.example.json`
- `config/environments/production.example.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `tsconfig.json`
- `vitest.config.ts`

## TDD evidence

### RED

The initial direct Vitest invocation, after adding the three tests for wrong
prefix, missing build identity, and public projection, failed as expected:

```text
Error: Cannot find module '../src/config/server-config.js'
```

This occurred before the production module existed. The test suite contains:

- production/development environment prefix rejection with
  `/production.*wrong prefix/i`;
- required `AURA_BUILD_COMMIT` build identity;
- `toPublicBuildInfo` redaction, asserting only `commit` and `builtAt` and no
  `cloudbaseEnvironmentId`.

### GREEN

Not available: the workspace `node_modules` directory was recreated by pnpm
during dependency reconciliation and the dependency restore has not completed.
The attempted command was:

```text
pnpm install --trust-lockfile --no-frozen-lockfile --reporter append-only
```

It updated the lockfile importer but reported:

```text
GET https://registry.npmjs.org/zod error (ECONNRESET). Will retry in 10 seconds.
```

Consequently, `vitest`, `tsc`, ESLint, and the required package links are not
available for a GREEN run.

## Full quality

Not run successfully because the above dependency restore left no local
`node_modules/vitest/vitest.mjs` or app-level `zod` link. `git diff --check`
completed without whitespace errors. `check:secrets` was run directly with the
host Node runtime and exited 0 with no findings.

On resumption, the required offline/frozen recovery command also failed before
installing modules:

```text
node .../pnpm.mjs install --offline --frozen-lockfile --trust-lockfile
[ERROR] Failed to resolve @pnpm/exe@10.15.0 in package mirror
C:\Users\26119\AppData\Local\pnpm-cache\v11\metadata\registry.npmjs.org\@pnpm\exe.jsonl
```

Using the bundled fallback wrapper with `pnpm_config_pm_on_fail=ignore` avoids
that package-manager-version lookup, but the restored command still cannot
complete offline because the local store lacks an unrelated root dependency:

```text
[ERR_PNPM_NO_OFFLINE_TARBALL] A package is missing from the store but cannot
download it in offline mode. The missing package may be downloaded from
https://registry.npmjs.org/@types/node/-/node-22.15.30.tgz.
```

A later restore attempt populated the virtual store but did not recreate the
top-level `node_modules/vitest` link, so the focused command could not reach
Vitest. Retrying the prescribed offline/frozen linker then reported a different
missing tarball:

```text
[ERR_PNPM_NO_OFFLINE_TARBALL] A package is missing from the store but cannot
download it in offline mode. The missing package may be downloaded from
https://registry.npmjs.org/@eslint/js/-/js-9.33.0.tgz.
```

## Final verification evidence

Focused GREEN test:

```text
apps/cloud-functions/test/server-config.test.ts (3 tests) 8ms
Test Files  1 passed (1)
Tests  3 passed (3)
```

The lockfile resolves `esbuild@0.28.2`. The exact-version pnpm 11 policy is:

```text
allowBuilds:
  "esbuild@0.28.2": true
```

The successful frozen install reused 220 packages with no downloads and ran
only this build script:

```text
.../esbuild@0.28.2/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.28.2/node_modules/esbuild postinstall: Done
```

`check:secrets` and `tsc -b` both exited 0. A fresh full `pnpm quality` run
passed formatting, lint, boundaries, secrets, typecheck, 11/11 Node quality
tests, and 5/5 Vitest tests across two files.

## Self-review

- `loadServerConfig` strictly parses non-secret runtime values using the shared
  environment schema and validates each environment's CloudBase ID prefix.
- Prefix errors mention only the process environment and generic reason, never
  echo the CloudBase ID.
- `toPublicBuildInfo` parses and returns only the shared public build shape.
- `.env.example` and all three environment examples contain safe identifiers,
  not credentials.
- Root TypeScript and Vitest discovery include the new app.

## Commit

`build: isolate runtime environments`.

## Concerns

- Host pnpm is 11.19.0 while the project pins pnpm 10.15.0, which reformatted
  `pnpm-lock.yaml` broadly while adding the required app importer.
- The project pins pnpm 10.15.0, but its offline package mirror does not have
  all required tarballs. The latest offline restore reports
  `@eslint/js@9.33.0` missing (an earlier attempt reported
  `@types/node@22.15.30`), so a successful restore requires a consistent,
  populated offline store before GREEN, `typecheck`, and full quality can run.

- Resolved: pnpm 11 uses `allowBuilds` in `pnpm-workspace.yaml`; the final
  policy authorizes only `esbuild@0.28.2`, and the successful frozen install
  ran that postinstall with no other build scripts.
- The product owner authorized only `esbuild@0.28.2`; the lockfile resolves
  exactly that version. The requested root `package.json` policy was added as
  `pnpm.onlyBuiltDependencies: ["esbuild"]`. However, the available pnpm 11
  fallback wrapper reports that it no longer reads the `pnpm` field in
  `package.json` and ignores this key. It then attempted registry downloads
  and received `EACCES`; no dependency build scripts ran. No replacement
  policy location was changed because that would exceed the authorization.
