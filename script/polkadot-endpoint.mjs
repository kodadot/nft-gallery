import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { prodParasPolkadotCommon, prodParasKusamaCommon } from '@polkadot/apps-config'

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Find endpoints for both Asset Hubs
const ahp = prodParasPolkadotCommon.find(key => key.info === 'PolkadotAssetHub')
const kahp = prodParasKusamaCommon.find(key => key.info === 'KusamaAssetHub')
const ahpProviders = Object.values(ahp?.providers)
const kahpProviders = Object.values(kahp?.providers)

// Helper function to create provider promises
const createProviderPromises = (urls, network) => urls.map(async (url) => {
  try {
    const wsProvider = new WsProvider(url)
    const api = new ApiPromise({ provider: wsProvider, noInitWarn: true })
    await api.isReady
    await api.rpc.system.chain()
  }
  catch (error) {
    console.error(`Failed to connect to ${url}`, error)
  }

  return { network, url }
})

// Create array of promises for both networks
const polkadotPromises = createProviderPromises(ahpProviders, 'Polkadot')
const kusamaPromises = createProviderPromises(kahpProviders, 'Kusama')

// Race to find fastest responding endpoints for both networks
Promise.all([
  Promise.race(polkadotPromises),
  Promise.race(kusamaPromises),
])
  .then(([polkadot, kusama]) => {
    const endpointsData = {
      ahp: {
        endpoint: polkadot.url,
        providers: ahpProviders,
      },
      ahk: {
        endpoint: kusama.url,
        providers: kahpProviders,
      },
    }

    // Ensure directory exists
    const dir = path.join(__dirname, '../libs/static/src')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Write to JSON file
    fs.writeFileSync(
      path.join(dir, 'endpoints.json'),
      JSON.stringify(endpointsData, null, 2),
    )

    console.clear()
    console.log(`Endpoints data has been written to ${dir}`)
    console.log('Fastest Polkadot provider:', polkadot.url)
    console.log('Fastest Kusama provider:', kusama.url)
  })
  .catch(console.error)
  .finally(() => {
    process.exit(0)
  })
