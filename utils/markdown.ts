// https://stackoverflow.com/questions/24686588/how-to-test-if-a-string-has-markdown-in-it
const isMarkdownString = (text: string): boolean => {
  return (
    /\[[^]]+\]\(https?:\/\/\S+\)/.test(text) ||
    /\s(__|\*\*)(?!\s)(.(?!\1))+(?!\s(?=\1))/.test(text)
  )
}

export const convertMarkdownToText = (text = ''): string => {
  if (isMarkdownString(text)) {
    text = text.replaceAll('**', '')
    text = text.replaceAll('__', '')
    text = text.replaceAll('\n', ' ')

    const urlsMatch = text.match(/\[\S+\]\(https?:\/\/\S+\)/g)
    if (urlsMatch) {
      urlsMatch.forEach((match) => {
        const matchName = match.match(/\[\S+\]/)
        if (matchName) {
          text = text.replaceAll(
            match,
            matchName[0].slice(1, matchName[0].length - 1),
          )
        }
      })
    }
  }

  return text
}
