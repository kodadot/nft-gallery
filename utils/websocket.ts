import { INDEXERS } from '@kodadot1/static'
import { apolloClientConfig } from './constants'

const wssConfig = {
  [INDEXERS.ahk]: 'wss://squid.subsquid.io/stick/graphql',
  [INDEXERS.ahp]: 'wss://squid.subsquid.io/speck/graphql',
  [INDEXERS.ksm]: 'wss://squid.subsquid.io/marck/v/v2/graphql',
}

export const getWSUrlByClient = (client: string): string | null => {
  const endPoint = apolloClientConfig[client]
  if (!endPoint) {
    return null
  }
  const { httpEndpoint } = endPoint

  const oldWss = wssConfig[httpEndpoint]
  if (oldWss) {
    return oldWss
  }

  return httpEndpoint.replace('https://', 'wss://').replace('http://', 'wss://')
}
