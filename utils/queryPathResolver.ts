import { emptyObject } from '@kodadot1/minimark'

type AvailableClients = 'subquery' | 'subsquid'
type Prefix = 'rmrk' | 'bsx' | 'statemine' | 'westmint'

type PathOptions = {
  client?: AvailableClients
  specialized?: boolean
}

const defaultPaths: Record<AvailableClients, string> = {
  subquery: '',
  subsquid: 'subsquid/general/',
}

function resolveQueryPath(
  prefix: string,
  queryName: string,
  opts?: PathOptions
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
    case 'subsquid':
      return 'subsquid/general/'
    default:
      return 'subsquid/general/'
  }
}

function getDefaultPathForClient(client: AvailableClients): string {
  return defaultPaths[client]
}

// const queryPaths: Record<string, { subsquid: string, subquery: string | undefined }> = {
//   'rmrk': {
//     subsquid: 'subsquid/general/',
//     subquery: '',
//   },
//   'bsx': {
//     subsquid: 'subsquid/general/',
//     subquery: undefined,
//   }

// }

export default resolveQueryPath
