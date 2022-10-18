import hljs from 'highlight.js'

const highlight = function (str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(str, { language: lang }).value
    } catch (__) {
      return ''
    }
  }
  return ''
}

export default highlight
