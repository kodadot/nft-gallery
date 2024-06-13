type LinkableBlock = {
  regex: RegExp
  template: (match: string) => string
}

const createLink = (content: string, url: string) => `[${content}](${url})`

const LINKABLE_BLOCKS: LinkableBlock[] = [
  {
    regex: /(?<!\[.*?)(?<!\()[/](\w+)(?![^\[]*\])(?![^\(]*\))/,
    template: (match: string) => `https://warpcast.com/~/channel${match}`,
  },
  {
    regex: /(?<!\[.*?\]\()@(\w{1,15})(?=\b)(?![^\[]*\])/,
    template: (match: string) =>
      `https://warpcast.com/${match.slice(1, match.length)}`,
  },
]

export const getBioWithLinks = (description: string) => {
  return LINKABLE_BLOCKS.reduce(
    (reducer, { regex, template }) =>
      reducer.replace(new RegExp(regex, 'g'), (match: string) =>
        createLink(match, template(match)),
      ),
    description,
  )
}
