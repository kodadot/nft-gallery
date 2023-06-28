// https://stackoverflow.com/questions/24686588/how-to-test-if-a-string-has-markdown-in-it
export const isMarkdownString = (text: string): boolean => {
  return (
    /\[[^]]+\]\(https?:\/\/\S+\)/.test(text) ||
    /\s(__|\*\*)(?!\s)(.(?!\1))+(?!\s(?=\1))/.test(text)
  )
}
