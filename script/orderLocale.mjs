import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import prettier from 'prettier'

// Check if value is an object. Do not count arrays as objects.
const isObject = o => (Array.isArray(o) ? false : typeof o === 'object')

// Get files from given directory.
const getDirectoryFiles = (source, omit) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(v => !omit.includes(v.name))
    .map(dirent => dirent.name)

// Order keys of a json object.
const orderKeysAlphabetically = o =>
  Object.keys(o)
    .sort()
    .reduce((obj, key) => {
      obj[key] = o[key]
      return obj
    }, {})

// Order json object by its keys.
const orderJsonByKeys = (json) => {
  // order top level keys.
  json = orderKeysAlphabetically(json)
  // order child objects if they are values.
  const jsonOrdered = {}
  Object.entries(json).forEach(
    ([k, v]) => isObject(v)
      ? jsonOrdered[k] = orderJsonByKeys(v)
      : jsonOrdered[k] = v,
  )
  return jsonOrdered
}

// Project locale directory.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const localeDir = path.join(__dirname, '..', 'locales')

// Get all language paths to re-order.
const languages = getDirectoryFiles(localeDir, []).filter(file => file.endsWith('.json'))

// For each language path.
for (const lng of languages) {
  const pathToLanguageFile = path.join(localeDir, `/${lng}`)

  fs.readFile(pathToLanguageFile, async (error) => {
    if (error) return

    const json = JSON.parse(fs.readFileSync(pathToLanguageFile).toString())

    // order json object alphabetically.
    const orderedJson = orderJsonByKeys(json)

    // format json object.
    const formatted = await prettier.format(JSON.stringify(orderedJson), {
      parser: 'json',
    })

    fs.writeFile(pathToLanguageFile, formatted, (err) => {
      if (err) {
        console.err(err)
      }
      else {
        console.log(`✅ Keys in ${pathToLanguageFile} are sorted alphabetically`)
      }
    })
  })
}
