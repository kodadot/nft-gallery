type LinkableSocialMedia = {
  regex: RegExp
  template: (match: string) => string
}

const createLink = (content: string, url: string) => `[${content}](${url})`

const LINKABLE_SOCIAL_MEDIAS: LinkableSocialMedia[] = [
  {
    regex: /\/\S+/,
    template: (match: string) => `https://warpcast.com/~/channel${match}`,
  },
  {
    regex: /@(\w+)/,
    template: (match: string) =>
      `https://twitter.com/${match.slice(1, match.length)}`,
  },
]

export const getDescriptionWithSocialLinks = (description: string) => {
  return LINKABLE_SOCIAL_MEDIAS.reduce(
    (reducer, { regex, template }) =>
      reducer.replace(new RegExp(regex, 'g'), (match: string) =>
        createLink(match, template(match)),
      ),
    description,
  )
}
