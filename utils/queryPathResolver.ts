function resolveQueryPath(
  prefix: string,
  queryName: string
): Promise<typeof import('*.graphql')> {
  const path = getPath(prefix)
  return import(/* @vite-ignore */ `../queries/${path}${queryName}.graphql`)
}

function getPath(prefix: string) {
  switch (prefix) {
    case 'chain-ahk':
      return 'subsquid/ahk/'
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
