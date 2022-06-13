import consola from 'consola'

function resolveQueryPath(
  prefix: string,
  queryName: string
): Promise<typeof import('*.graphql')> {
  const path = getPath(prefix)
  return import(`@/queries/${path}${queryName}.graphql`).catch((e) => {
    consola.error(`import queries ${queryName} error`, e)
  })
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
    case 'subsquid':
      return 'subsquid/general/'
    default:
      return ''
  }
}

export default resolveQueryPath
