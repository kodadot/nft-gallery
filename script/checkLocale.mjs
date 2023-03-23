import fs from 'fs/promises'
import path from 'path'

const CONSTANTS = {
  BASE_LOCALE: 'en',
  LOCALE_DIR: 'locales',
  LOCALES: ['en', 'fr', 'de', 'es'], // "ALL" or locales needed eg. ["fr","de"]
}

async function readJson(filePath) {
  try {
    const content = await fs.readFile(filePath, { encoding: 'utf8' })
    return JSON.parse(content)
  } catch (err) {
    throw new Error(err.message)
  }
}

async function writeJson(filePath, json) {
  await fs.writeFile(filePath, JSON.stringify(json, null, 2))
}

async function getLocales() {
  const locales = {}
  let dirs = []
  if (CONSTANTS.LOCALES === 'ALL') {
    // get json file like en.json, fr.json in locale directory
    dirs = (await fs.readdir(path.join(CONSTANTS.LOCALE_DIR))).filter(
      (fileName) => /^[a-z]{2}\.json/.test(fileName)
    )
  } else if (Array.isArray(CONSTANTS.LOCALES)) {
    dirs = CONSTANTS.LOCALES.map((lang) => `${lang}.json`)
  }
  for (let key of dirs) {
    locales[key] = await readJson(path.join(CONSTANTS.LOCALE_DIR, key))
  }
  return locales
}

function sortJson(json) {
  let sorted = {}
  Object.keys(json)
    // compare key case-insensitive
    .sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()))
    .forEach((key) => {
      if (typeof json[key] === 'object') {
        sorted[key] = sortJson(json[key])
      } else {
        sorted[key] = json[key]
      }
    })
  return sorted
}

function compareLocale(baseLocale, locale, prefix = '') {
  let res = []
  Object.keys(baseLocale).forEach((key) => {
    if (locale[key] === undefined) {
      res.push(`${prefix}${key}`)
    } else if (typeof baseLocale[key] === 'object') {
      res = res.concat(
        compareLocale(baseLocale[key], locale[key], `${prefix}${key}.`)
      )
    }
  })
  return res
}

async function resortJson() {
  const allLocales = await getLocales()
  Object.keys(allLocales).forEach(async (locale) => {
    const sortedJson = sortJson(allLocales[locale])
    await writeJson(path.join(CONSTANTS.LOCALE_DIR, locale), sortedJson)
  })
}

async function checkLocale() {
  const res = {}
  const baseLocale = await readJson(
    path.join(CONSTANTS.LOCALE_DIR, `${CONSTANTS.BASE_LOCALE}.json`)
  )
  const allLocales = await getLocales()

  for (let locale in allLocales) {
    const localeJson = await readJson(path.join(CONSTANTS.LOCALE_DIR, locale))
    const list = compareLocale(baseLocale, localeJson)
    if (list.length > 0) {
      res[locale] = list
    }
  }
  return res
}

await resortJson()

const checkResult = await checkLocale()

if (Object.keys(checkResult).length > 0) {
  const table = [['Locale File', 'Missing Key(s)']]
  Object.keys(checkResult).forEach((key) => {
    table.push([key, checkResult[key]])
  })
  console.table(table)
  throw new Error('Missing Translations')
}
