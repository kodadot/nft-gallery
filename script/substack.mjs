import fetch from 'node-fetch'
import { load } from 'cheerio'
import fs from 'fs/promises'
import consola from 'consola'

async function init() {
  try {
    const response = await fetch(
      'https://kodadot.substack.com/archive?sort=new'
    )
    const body = await response.text()
    const $dom = load(body)
    const list = $dom(
      '.portable-archive-list .post-preview.portable-archive-post.has-image'
    )

    const post = list
      .slice(0, 3)
      .map(function (i, el) {
        const title = $dom(el).find('.post-preview-title').text()
        const description = $dom(el).find('.post-preview-description').text()
        const image = $dom(el).find('.post-preview-image source').attr('srcset')
        const link = $dom(el).find('.post-preview-title').attr('href')

        return { title, description, image, link }
      })
      .toArray()

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
