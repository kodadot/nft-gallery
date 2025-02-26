import type { ApolloEndpoint, Config, Prefix, Squid } from './types'

type SquidUrl = 'https://squid.subsquid.io' | 'https://kodadot.squids.live'

type SquidEndpoint =
  | `${SquidUrl}/${Squid}/graphql`
  | `${SquidUrl}/${Squid}/v/${string}/graphql`
  | `https://${Prefix}.gql.api.kodadot.xyz/`

export const INDEXERS: Config<SquidEndpoint> = {
  ksm: 'https://ahk.gql.api.kodadot.xyz/', // DEV: show KusamaHub
  ahk: 'https://ahk.gql.api.kodadot.xyz/',
  ahp: 'https://ahp.gql.api.kodadot.xyz/',
  dot: 'https://ahp.gql.api.kodadot.xyz/', // DEV: show PolkadotHub
  base: 'https://kodadot.squids.live/basick/graphql',
  mnt: 'https://squid.subsquid.io/flock/graphql',
  // ahr: 'https://squid.subsquid.io/snack/graphql',
  // movr: 'https://squid.subsquid.io/antick/v/001-rc0/graphql',
  // glmr: 'https://squid.subsquid.io/click/v/002/graphql',
}

export const toApolloEndpoint = (httpEndpoint: string): ApolloEndpoint => ({
  httpEndpoint,
})

const reducer = (
  acc: Config<ApolloEndpoint>,
  [key, value]: [string, SquidEndpoint],
) => {
  acc[key as Prefix] = toApolloEndpoint(value)
  return acc
}

export const APOLLO_ENDPOINTS: Config<ApolloEndpoint> = Object.entries(
  INDEXERS,
).reduce(
  (accumulator, element) => reducer(accumulator, element),
  {} as Config<ApolloEndpoint>,
)
