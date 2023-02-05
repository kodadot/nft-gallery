import hljs from 'highlight.js'

const highlight = function (str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return (
        '<pre class="hljs"><code>' +
        hljs.highlight(str, { language: lang }).value +
        '</code></pre>'
      )
    } catch (__) {
      return ''
    }
  }
  return ''
}

export default highlight
