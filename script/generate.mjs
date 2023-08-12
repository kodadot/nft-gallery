import { spawn } from 'child_process'

const generate = spawn('pnpm', ['generate:script'])

generate.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)

  if (data.includes('failed to parse')) {
    console.log('exit(1)')
    process.exit(1)
  }
})
generate.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`)

  if (data.includes('failed to parse')) {
    console.log('exit(1)')
    process.exit(1)
  }
})
generate.on('close', (code) => {
  console.log(`child process exited with code ${code}`)
})
