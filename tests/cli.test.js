import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cliPath = path.join(repoRoot, 'src', 'index.js')

function runEnvolix(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, ...args], {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', chunk => {
      stdout += chunk
    })
    child.stderr.on('data', chunk => {
      stderr += chunk
    })
    child.on('error', reject)
    child.on('close', code => {
      resolve({ code, stdout, stderr })
    })
  })
}

describe('envolix CLI', () => {
  it('prints top-level help successfully', async () => {
    const result = await runEnvolix(['--help'])

    assert.equal(result.code, 0)
    assert.match(result.stdout, /Usage:\n  envolix \[command\] \[options\]/)
    assert.match(result.stdout, /sync \[source\] \[target\]/)
    assert.match(result.stdout, /Source Environment File/)
    assert.equal(result.stderr, '')
  })

  it('prints Sync command help with default paths successfully', async () => {
    const result = await runEnvolix(['sync', '--help'])

    assert.equal(result.code, 0)
    assert.match(result.stdout, /Usage:\n  envolix sync \[source\] \[target\] \[options\]/)
    assert.match(result.stdout, /Source Environment File \(default: \.env\)/)
    assert.match(result.stdout, /Sync Target \/ Example Environment File \(default: \.env\.example\)/)
    assert.match(result.stdout, /Blank Assignments/)
    assert.equal(result.stderr, '')
  })

  it('returns a non-success placeholder for Sync behavior', async () => {
    const result = await runEnvolix(['sync'])

    assert.equal(result.code, 1)
    assert.equal(result.stdout, '')
    assert.match(result.stderr, /Sync is not implemented yet\./)
    assert.match(result.stderr, /No Sync Target was written/)
    assert.match(result.stderr, /Source Environment File "\.env"/)
    assert.match(result.stderr, /Sync Target "\.env\.example"/)
  })
})
