import { INDEXERS } from '@kodadot1/vuex-options'

type Endpoint = {
  httpEndpoint: string
}

const toClient = (value: string): string => {
  switch (value) {
    case 'kusama':
      return 'rmrk'
    case 'rmrk':
      return 'ksm'
    default:
      return value
  }
}

export const toApolloEndpoint = (httpEndpoint: string): Endpoint => ({
  httpEndpoint,
})

export default () => {
  const configs = {}

  INDEXERS.map((option) => {
    configs[toClient(option.info)] = toApolloEndpoint(String(option.value))
  })

  return configs
}
