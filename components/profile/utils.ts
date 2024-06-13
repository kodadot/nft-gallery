type LinkableBlock = {
  regex: RegExp
  template: (match: string) => string
}

const createLink = (content: string, url: string) => `[${content}](${url})`

const LINKABLE_BLOCKS: LinkableBlock[] = [
  {
    regex:
      /(?<!\[[^\]]*)(?<!\([^\)]*)(?<!<a[^>]*>)\/\w+(?![^<>]*<\/a>)(?![^<>]*>)(?![^\[]*\])(?![^\(]*\))/,
    template: (match: string) => `https://warpcast.com/~/channel${match}`,
  },
  {
    regex:
      /(?<!\[[^\]]*)(?<!\([^\)]*)(?<!<a[^>]*>)@(\w{1,15})\b(?!<\/a>)(?![^\[]*\])(?![^\(]*\))/,
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
