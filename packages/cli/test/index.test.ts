import { beforeAll, describe, expect, it } from 'vite-plus/test';

import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const packageRoot = resolve(import.meta.dirname, '..');
const workspaceRoot = resolve(packageRoot, '..', '..');
const binPath = resolve(packageRoot, 'dist/index.mjs');
const { NO_COLOR: _noColor, ...colorEnabledEnv } = process.env;

async function runCli(args: readonly string[], cwd: string) {
  return execFileAsync(process.execPath, [binPath, ...args], {
    cwd,
    env: {
      ...colorEnabledEnv,
      FORCE_COLOR: '1',
    },
  });
}

async function withTempProject<T>(callback: (cwd: string) => Promise<T>): Promise<T> {
  const cwd = await mkdtemp(join(tmpdir(), 'envolix-cli-'));

  try {
    return await callback(cwd);
  } finally {
    await rm(cwd, { force: true, recursive: true });
  }
}

describe('@envolix/cli', () => {
  beforeAll(async () => {
    await execFileAsync('pnpm', ['--filter', '@envolix/env-parser', 'run', 'pack'], {
      cwd: workspaceRoot,
    });
    await execFileAsync('pnpm', ['--filter', '@envolix/cli', 'run', 'pack'], {
      cwd: workspaceRoot,
    });
  });

  it('publishes an envolix binary with top-level help', async () => {
    const packageJson = JSON.parse(
      await readFile(resolve(packageRoot, 'package.json'), 'utf8'),
    ) as { bin?: { envolix?: string } };
    const packageBinPath = packageJson.bin?.envolix;

    expect(packageBinPath).toBe('./dist/index.mjs');

    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [resolve(packageRoot, packageBinPath ?? ''), '--help'],
      {
        cwd: packageRoot,
      },
    );

    expect(stderr).toBe('');
    expect(stdout).toContain('Usage: envolix [options] [command]');
    expect(stdout).toContain('Generate safe example env files');
    expect(stdout).toContain('gen');
    expect(stdout).toContain('Generate an example env file');
    expect(dirname(packageBinPath ?? '')).toBe('./dist');
  });

  it('documents gen options and defaults in command help', async () => {
    const { stdout, stderr } = await runCli(['gen', '--help'], packageRoot);

    expect(stderr).toBe('');
    expect(stdout).toContain('Usage: envolix gen [options]');
    expect(stdout).toContain('-s, --source <path>');
    expect(stdout).toContain('-t, --target <path>');
    expect(stdout).toContain('(default: ".env")');
    expect(stdout).toContain('(default: ".env.example")');
  });

  it('generates .env.example from .env by default', async () => {
    await withTempProject(async (cwd) => {
      await writeFile(
        join(cwd, '.env'),
        [
          '# service',
          'export API_KEY=secret # keep this #varType:secret',
          '',
          'PORT=3000',
          '',
        ].join('\n'),
      );

      const { stdout, stderr } = await runCli(['gen'], cwd);

      await expect(readFile(join(cwd, '.env.example'), 'utf8')).resolves.toBe(
        ['# service', 'export API_KEY= # keep this #varType:secret', '', 'PORT=', ''].join('\n'),
      );
      expect(stderr).toBe('');
      expect(stdout).toContain('Generated .env.example from .env');
      expect(stdout).toContain('\u001B[32m');
    });
  });

  it('uses the default source with a custom target', async () => {
    await withTempProject(async (cwd) => {
      await writeFile(join(cwd, '.env'), 'TOKEN=secret\n');

      await runCli(['gen', '--target', '.env.sample'], cwd);

      await expect(readFile(join(cwd, '.env.sample'), 'utf8')).resolves.toBe('TOKEN=\n');
    });
  });

  it('uses custom source and target paths', async () => {
    await withTempProject(async (cwd) => {
      await writeFile(join(cwd, '.env.prod'), 'PROD_TOKEN=secret\n');

      await runCli(['gen', '--source', '.env.prod', '--target', '.env.staging'], cwd);

      await expect(readFile(join(cwd, '.env.staging'), 'utf8')).resolves.toBe('PROD_TOKEN=\n');
    });
  });

  it('supports source and target aliases', async () => {
    await withTempProject(async (cwd) => {
      await writeFile(join(cwd, '.env.prod'), 'ALIAS_TOKEN=secret\n');

      await runCli(['gen', '-s', '.env.prod', '-t', '.env.alias'], cwd);

      await expect(readFile(join(cwd, '.env.alias'), 'utf8')).resolves.toBe('ALIAS_TOKEN=\n');
    });
  });

  it('resolves relative paths from the current working directory', async () => {
    await withTempProject(async (cwd) => {
      await writeFile(join(cwd, '.env'), 'ROOT_TOKEN=secret\n');

      await runCli(['gen', '--target', 'nested.env'], cwd);

      await expect(readFile(join(cwd, 'nested.env'), 'utf8')).resolves.toBe('ROOT_TOKEN=\n');
    });
  });

  it('overwrites existing targets without validating or merging target content', async () => {
    await withTempProject(async (cwd) => {
      await writeFile(join(cwd, '.env'), 'SOURCE=value\n');
      await writeFile(join(cwd, '.env.example'), 'not valid env content');

      await runCli(['gen'], cwd);

      await expect(readFile(join(cwd, '.env.example'), 'utf8')).resolves.toBe('SOURCE=\n');
    });
  });

  it('creates the target when it is missing and the parent directory exists', async () => {
    await withTempProject(async (cwd) => {
      await writeFile(join(cwd, '.env'), 'CREATED=value\n');

      await runCli(['gen', '--target', 'created.env'], cwd);

      await expect(readFile(join(cwd, 'created.env'), 'utf8')).resolves.toBe('CREATED=\n');
    });
  });
});
