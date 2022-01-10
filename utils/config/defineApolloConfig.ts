import { INDEXERS } from '@vue-polkadot/vue-settings'

type Endpoint = {
  httpEndpoint: string
}

const toClient = (value: string): string => value !== 'kusama' ? value : 'rmrk'
export const toApolloEndpoint = (httpEndpoint: string): Endpoint => ({ httpEndpoint })

export default () => {
  const configs = {}

  INDEXERS.map(option => {
    configs[toClient(option.info)] = toApolloEndpoint(String(option.value))
  })

  return configs
}
