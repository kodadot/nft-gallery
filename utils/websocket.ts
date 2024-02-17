import { INDEXERS } from '@kodadot1/static'
import { apolloClientConfig } from './constants'

export const getWSUrlByClient = (client: string): string | null => {
  const endPoint = apolloClientConfig[client]
  if (!endPoint) {
    return null
  }
  const { httpEndpoint } = endPoint

  if (httpEndpoint === INDEXERS.ahk) {
    return 'wss://squid.subsquid.io/stick/graphql'
  }

  if (httpEndpoint === INDEXERS.ahp) {
    return 'wss://squid.subsquid.io/speck/graphql'
  }

  return httpEndpoint.replace('https://', 'wss://').replace('http://', 'wss://')
}
