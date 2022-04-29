function resolveQueryPath(
  prefix: string,
  queryName: string
): Promise<typeof import('*.graphql')> {
  const path = getPath(prefix)
  return import(`@/queries/${path}${queryName}.graphql`)
}

function getPath(prefix: string) {
  switch (prefix) {
    case 'rmrk':
      return ''
    case 'bsx':
      return 'subsquid/general/'
    case 'statemine':
    case 'westmint':
      return 'unique/'
    default:
      return ''
  }
}

export default resolveQueryPath
