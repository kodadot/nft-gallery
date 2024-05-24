type LinkableSocialMedia = {
  regex: RegExp
  template: (match: string) => string
}

const createLink = (content: string, url: string) =>
  `<a href="${url}" target="_blank" rel="nofollow noopener noreferrer">${content}</a>`

const LINKABLE_SOCIAL_MEDIAS: LinkableSocialMedia[] = [
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

export const getDescriptionWithSocialLinks = (description: string) => {
  return LINKABLE_SOCIAL_MEDIAS.reduce(
    (reducer, { regex, template }) =>
      reducer.replace(new RegExp(regex, 'g'), (match: string) =>
        createLink(match, template(match)),
      ),
    description,
  )
}