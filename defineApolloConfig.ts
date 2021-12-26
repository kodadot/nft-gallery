import { INDEXERS } from '@vue-polkadot/vue-settings'

const toClient = (value: string): string => value !== 'kusama' ? value : 'rmrk'

export default () => {
  const configs = {}

  INDEXERS.map(option => {
    configs[toClient(option.info)] = {
      httpEndpoint: option.value,
    }
  })

  return configs
}
