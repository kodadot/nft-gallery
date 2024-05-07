import { createAppClient, viemConnector } from '@farcaster/auth-client'

export const appClient = createAppClient({
  relay: 'https://relay.farcaster.xyz',
  ethereum: viemConnector(),
})

export const createChannel = () =>
  appClient.createChannel({
    siweUri: window.location.origin,
    domain: window.location.host,
    expirationTime: new Date(Date.now() + 1000 * 60 * 5).toISOString(), // 5 minutes
  })
