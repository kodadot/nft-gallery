function resolveQueryPath(
  prefix: string,
  queryName: string,
): Promise<typeof import('*.graphql')> {
  // TODO: find a better way?
  const path = getPath(prefix)
  const MODULES = import.meta.glob('../queries/**/*.graphql')
  return MODULES[`../queries/${path}${queryName}.graphql`]() as Promise<
    typeof import('*.graphql')
  >
  // return import(/* @vite-ignore */ `../queries/${path}${queryName}.graphql`)
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
