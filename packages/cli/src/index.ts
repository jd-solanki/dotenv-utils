#!/usr/bin/env node
import { parseEnvDocument, renderExampleEnvDocument } from '@envolix/env-parser';
import { Command } from 'commander';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import pc from 'picocolors';
import packageJson from '../package.json' with { type: 'json' };

const program = new Command('envolix')
  .description('Generate safe example env files from source env files.')
  .version(packageJson.version);

program
  .command('gen')
  .description('Generate an example env file with private values removed.')
  .option('-s, --source <path>', 'source env file', '.env')
  .option('-t, --target <path>', 'target env file', '.env.example')
  .action(async (options: { source: string; target: string }) => {
    const sourcePath = resolve(process.cwd(), options.source);
    const targetPath = resolve(process.cwd(), options.target);
    const source = await readFile(sourcePath, 'utf8');
    const document = parseEnvDocument(source);
    const output = renderExampleEnvDocument(document);

    await writeFile(targetPath, output, 'utf8');

    console.log(pc.green(`Generated ${options.target} from ${options.source}`));
  });

await program.parseAsync();
