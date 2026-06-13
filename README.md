# Envolix

Envolix helps teams derive shareable example env files from private env files while keeping the human-authored structure readable.

## Packages

- `@envolix/env-parser`: parser and generation domain package. Later implementation slices will add the ordered env document AST, diagnostics, validation, and rendering.
- `@envolix/cli`: binary package for the `envolix` command. It currently exposes top-level Commander help; later implementation slices will add generation filesystem behavior.

## CLI

```bash
envolix --help
```

The top-level help lists available commands and options. The `gen` command is reserved for the generation workflow that will be implemented in a later slice.

## Toolchain

This repository is a Vite+ monorepo. Use `vp` as the canonical task entry point so the project runs with the configured Node 24 runtime and pnpm workspace setup.

```bash
vp install
vp check
vp test
vp run -r pack
```

The root `vite.config.ts` owns formatting, linting, tests, staged-file checks, cached workspace tasks, and package packing. Package builds are ESM-only and emit TypeScript declarations through `vp pack`.

## Releases

This monorepo publishes each workspace package from its own package directory. Do not publish the private repository root.

Before relying on automation, manually publish each public package once with npm ownership:

```bash
cd packages/env-parser
npm publish --access public

cd ../cli
npm publish --access public
```

After the first publish, configure npm trusted publishing on both package settings pages:

- `@envolix/env-parser`
- `@envolix/cli`

Use GitHub Actions as the trusted publisher with organization/user `jd-solanki`, repository `envolix`, workflow filename `publish.yml`, and allowed action `npm publish`. Leave the environment name blank unless the workflow starts using a GitHub environment.

Automated releases are tag driven. Use package-specific release tags so the workflow can publish exactly one package and generate changelogs from scoped Conventional Commits:

```bash
nr release:env-parser
nr release:cli
```

These scripts perform patch releases with package-scoped `bumpp` tags. Use the underlying `bumpp minor`, `bumpp major`, or explicit version command manually when appropriate. The publish workflow verifies that the selected package version is not already on npm, runs checks, tests, and package builds, runs `changelogen` with an explicit previous same-package tag range, then publishes only the selected package with npm trusted publishing and creates a GitHub release.

## Layout

```text
packages/
  env-parser/
    src/
    test/
  cli/
    src/
    test/
```

The source env parser and the CLI are intentionally separate packages. The CLI will remain thin over `@envolix/env-parser`, which keeps reusable parsing and generation behavior in the library package.
