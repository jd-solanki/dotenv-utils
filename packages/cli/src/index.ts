#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';

const program = new Command('envolix')
  .description('Generate safe example env files from source env files.')
  .version('0.0.0');

program
  .command('gen')
  .description('Generate an example env file with private values removed.')
  .action(() => {
    program.error(pc.red('error: envolix gen is not implemented yet'));
  });

await program.parseAsync();
