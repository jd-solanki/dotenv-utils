export const DEFAULT_SOURCE_ENVIRONMENT_FILE = '.env'
export const DEFAULT_SYNC_TARGET = '.env.example'

export const syncHelpText = `Usage:
  envolix sync [source] [target] [options]

Description:
  Project one Source Environment File to one file-based Sync Target.
  Source values are omitted from the Example Environment File as Blank Assignments.

Arguments:
  source                 Source Environment File (default: .env)
  target                 File-based Sync Target / Example Environment File (default: .env.example)

Options:
  -h, --help             Show help

Examples:
  envolix sync
  envolix sync .env .env.example
`

/**
 * Handles the current Sync command surface while the file rewrite behavior is
 * still owned by later MVP slices.
 */
export async function runSync(args, { stdout, stderr }) {
  if (args.includes('-h') || args.includes('--help')) {
    stdout.write(syncHelpText)
    return 0
  }

  const source = args[0] ?? DEFAULT_SOURCE_ENVIRONMENT_FILE
  const target = args[1] ?? DEFAULT_SYNC_TARGET

  stderr.write(
    [
      'Sync is not implemented yet.',
      `No Sync Target was written for Source Environment File "${source}" and Sync Target "${target}".`,
      'Run `envolix sync --help` to see the intended file-to-file Sync workflow.',
      '',
    ].join('\n'),
  )

  return 1
}
