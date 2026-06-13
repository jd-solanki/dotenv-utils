import { describe, expect, it } from 'vite-plus/test';

import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const packageRoot = resolve(import.meta.dirname, '..');

describe('@envolix/cli', () => {
  it('publishes an envolix binary with top-level help', async () => {
    const packageJson = JSON.parse(
      await readFile(resolve(packageRoot, 'package.json'), 'utf8'),
    ) as { bin?: { envolix?: string } };
    const binPath = packageJson.bin?.envolix;

    expect(binPath).toBe('./dist/index.mjs');

    await execFileAsync('pnpm', ['--filter', '@envolix/cli', 'run', 'pack'], {
      cwd: resolve(packageRoot, '..', '..'),
    });

    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [resolve(packageRoot, binPath ?? ''), '--help'],
      {
        cwd: packageRoot,
      },
    );

    expect(stderr).toBe('');
    expect(stdout).toContain('Usage: envolix [options] [command]');
    expect(stdout).toContain('Generate safe example env files');
    expect(stdout).toContain('gen');
    expect(stdout).toContain('Generate an example env file');
    expect(dirname(binPath ?? '')).toBe('./dist');
  });
});
