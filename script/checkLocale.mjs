import fs from 'fs/promises'
import path from 'path'

// current support --baseLocale and --locales flag
// default baseLocale is "en", default locale is "all"
// e.g --baseLocale=en --locales=en,fr,de or --locales=all

const argArr = process.argv.slice(2)

let args = {
  baseLocale: 'en',
  locales: 'all',
}

argArr.forEach((arg) => {
  if (arg.indexOf('locales') > -1) {
    args.locales = arg
      .substring(arg.indexOf('=') + 1)
      .split(',')
      .map((x) => x.toLocaleLowerCase())
  }
  if (arg.indexOf('baseLocale') > -1) {
    args.baseLocale = arg.substring(arg.indexOf('=') + 1).toLocaleLowerCase()
  }
})

const CONSTANTS = {
  BASE_LOCALE: args.baseLocale,
  LOCALE_DIR: 'locales',
  LOCALES: args.locales,
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
  if (CONSTANTS.LOCALES === 'all') {
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
  await writeJson('locale-check.log.json', checkResult)
  throw new Error(
    '❌ Missing translations, please check locale-check.log.json for detail.'
  )
} else {
  console.log('🚀 Translation check passed!')
}
