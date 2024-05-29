type LinkableBlock = {
  regex: RegExp
  template: (match: string) => string
}

const createLink = (content: string, url: string) =>
  `<a href="${url}" target="_blank" rel="nofollow noopener noreferrer">${content}</a>`

const LINKABLE_BLOCKS: LinkableBlock[] = [
  {
    regex: /\/\S+/,
    template: (match: string) => `https://warpcast.com/~/channel${match}`,
  },
  {
    regex: /@(\w{1,15})\b/,
    template: (match: string) =>
      `https://warpcast.com/${match.slice(1, match.length)}`,
  },
]

export const getDescriptionWithLinks = (description: string) => {
  return LINKABLE_BLOCKS.reduce(
    (reducer, { regex, template }) =>
      reducer.replace(new RegExp(regex, 'g'), (match: string) =>
        createLink(match, template(match)),
      ),
    description,
  )
}
