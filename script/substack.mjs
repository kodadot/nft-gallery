import fetch from 'node-fetch'
import fs from 'fs/promises'
import consola from 'consola'

async function init() {
  try {
    const response = await fetch(
      'https://kodadot.substack.com/api/v1/archive?sort=new&search=&offset=0&limit=3'
    )
    const json = await response.json()
    const post = json.map((article) => {
      return {
        title: article.title,
        description: article.description,
        image: article.cover_image,
        link: article.canonical_url,
      }
    })

    await fs.writeFile(
      './script/substack.json',
      JSON.stringify({ post }, null, 2)
    )

    consola.info('substack.json created')
  } catch (error) {
    consola.error(error)
  }
}

init()
