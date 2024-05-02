import { createAppClient, viemConnector } from '@farcaster/auth-client'

export const appClient = createAppClient({
  relay: 'https://relay.farcaster.xyz',
  ethereum: viemConnector(),
})

export const createChannel = () =>
  appClient.createChannel({
    siweUri: window.location.origin,
    domain: window.location.host,
  })

export const getFarcasterUser = async (channelToken: string) => {
  const statusResponse = await appClient.watchStatus({
    channelToken: channelToken,
    timeout: 60_000,
    interval: 1_000,
    onResponse: ({ response, data }) => {
      console.log('Response code:', response.status)
      console.log('Status data:', data)
    },
  })

  return statusResponse.data
}
