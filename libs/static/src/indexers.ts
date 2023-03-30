import { ApolloEndpoint, Config, Prefix, Squid } from './types'

type SquidEndpoint =
  | `https://squid.subsquid.io/${Squid}/graphql`
  | `https://squid.subsquid.io/${Squid}/v/${string}/graphql`

export const INDEXERS: Config<SquidEndpoint> = {
  bsx: 'https://squid.subsquid.io/snekk/graphql',
  glmr: 'https://squid.subsquid.io/click/v/002/graphql',
  ksm: 'https://squid.subsquid.io/rubick/graphql',
  movr: 'https://squid.subsquid.io/antick/v/001-rc0/graphql',
  rmrk2: 'https://squid.subsquid.io/rubick/v/009-rc0/graphql',
  snek: 'https://squid.subsquid.io/snekk/v/004/graphql',
}

export const toApolloEndpoint = (httpEndpoint: string): ApolloEndpoint => ({
  httpEndpoint,
})

const reducer = (
  acc: Config<ApolloEndpoint>,
  [key, value]: [string, SquidEndpoint]
) => {
  acc[key as Prefix] = toApolloEndpoint(value)
  return acc
}

export const APOLLO_ENDPOINTS: Config<ApolloEndpoint> = Object.entries(
  INDEXERS
  // eslint-disable-next-line unicorn/no-array-reduce
).reduce(
  (accumulator, element) => reducer(accumulator, element),
  {} as Config<ApolloEndpoint>
)
