function resolveQueryPath(
  prefix: string,
  queryName: string
): Promise<typeof import('*.graphql')> {
  const path = getPath(prefix)
  return import(`@/queries/${path}${queryName}.graphql`)
}

function getPath(prefix: string) {
  switch (prefix) {
    case 'westmint':
      return 'unique/'
    case 'chain-bsx':
      return 'subsquid/bsx/'
    case 'chain-rmrk':
      return 'subsquid/rmrk/'
    case 'chain-ksm':
      return 'subsquid/ksm/'
    default:
      return 'subsquid/general/'
  }
}

export default resolveQueryPath
