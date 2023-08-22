import { exec, spawn } from 'child_process'
import { promisify } from 'util'

const promiseExec = promisify(exec)

async function getPath(cmd) {
  const { stdout } = await promiseExec('which ' + cmd)
  return stdout.trim()
}

async function runScript() {
  const pnpmPath = await getPath('pnpm')
  if (!pnpmPath) {
    console.error('failed to find pnpm')
    process.exit(1)
  }

  console.log(pnpmPath)

  const generate = spawn(pnpmPath, ['generate:script'], {
    env: {
      ...process.env,
    },
  })

  generate.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
    if (data.includes('failed to parse')) {
      console.log('exit(1)')
      process.exit(1)
    }
  })

  generate.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
    console.log('exit(1)')
    process.exit(1)
  })

  generate.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
}

runScript().catch((err) => {
  console.error(err)
  process.exit(1)
})
