import { ApolloEndpoint, Config, Prefix, Squid } from './types'

type SquidEndpoint =
  | `https://squid.subsquid.io/${Squid}/graphql`
  | `https://squid.subsquid.io/${Squid}/v/${string}/graphql`
  | `https://query-${Squid}.stellate.sh`

export const INDEXERS: Config<SquidEndpoint> = {
  rmrk: 'https://squid.subsquid.io/rubick/graphql',
  ksm: 'https://squid.subsquid.io/marck/v/v2/graphql',
  // ahk: 'https://query-stick.stellate.sh',
  ahk: 'https://squid.subsquid.io/stick/v/v9/graphql',
  dot: 'https://squid.subsquid.io/rubick/graphql', // TODO: change to dot indexer when available
  // ahp: 'https://squid.subsquid.io/speck/graphql',
  ahp: 'https://squid.subsquid.io/speck/v/v10/graphql',
  // ahr: 'https://squid.subsquid.io/snack/graphql',
  // movr: 'https://squid.subsquid.io/antick/v/001-rc0/graphql',
  // glmr: 'https://squid.subsquid.io/click/v/002/graphql',
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
