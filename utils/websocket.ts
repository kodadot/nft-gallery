import { apolloClientConfig } from './constants'

export const getWSUrlByClient = (client: string): string | null => {
  const endPoint = apolloClientConfig[client]
  if (!endPoint) {
    return null
  }
  const { httpEndpoint } = endPoint
  return httpEndpoint.replace('https://', 'wss://').replace('http://', 'wss://')
}
