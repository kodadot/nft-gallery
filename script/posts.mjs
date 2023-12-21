import fetch from 'node-fetch'
import fs from 'fs/promises'
import consola from 'consola'

async function init() {
  try {
    const response = await fetch('http://localhost:8787/index')
    const json = await response.json()

    await fs.writeFile('./script/posts.json', JSON.stringify(json, null, 2))

    consola.info('posts.json created')
  } catch (error) {
    consola.error(error)
  }
}

init()
