import { ApolloEndpoint, Config, Prefix, Squid } from './types'

type SquidEndpoint =
  | `https://squid.subsquid.io/${Squid}/graphql`
  | `https://squid.subsquid.io/${Squid}/v/${string}/graphql`
  | `https://${Prefix}.gql.api.kodadot.xyz/`

export const INDEXERS: Config<SquidEndpoint> = {
  rmrk: 'https://squid.subsquid.io/rubick/graphql',
  ksm: 'https://ksm.gql.api.kodadot.xyz/',
  ahk: 'https://ahk.gql.api.kodadot.xyz/',
  ahp: 'https://ahp.gql.api.kodadot.xyz/',
  dot: 'https://squid.subsquid.io/rubick/graphql', // TODO: change to dot indexer when available
  imx: 'https://squid.subsquid.io/flick/graphql',
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
