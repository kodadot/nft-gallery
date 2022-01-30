import '@polkadot/api-augment'
import Connector from '@kodadot1/sub-api'

export default ({ store }) => {
  const endpoint = store.state.setting.apiUrl
  const { getInstance: Api } = Connector
  console.log('[API PLUGIN]', endpoint)
  Api().connect(endpoint)
}
