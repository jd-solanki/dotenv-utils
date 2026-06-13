#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';
import packageJson from '../package.json' with { type: 'json' };

const program = new Command('envolix')
  .description('Generate safe example env files from source env files.')
  .version(packageJson.version);

program
  .command('gen')
  .description('Generate an example env file with private values removed.')
  .action(() => {
    program.error(pc.red('error: envolix gen is not implemented yet'));
  });

await program.parseAsync();
