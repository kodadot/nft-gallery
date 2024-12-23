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
  const startTime = Date.now()
  const wsProvider = new WsProvider(url)
  const api = new ApiPromise({ provider: wsProvider, noInitWarn: true })

  try {
    await api.isReady
    await api.rpc.system.chain()
    const responseTime = Date.now() - startTime
    return { network, url, responseTime, success: true }
  }
  catch (error) {
    console.error(`Failed to connect to ${url}`, error)
    return { network, url, success: false }
  }
  finally {
    await api.disconnect()
  }
})

// Helper to find fastest successful connection
const getFastestSuccessful = async (promises) => {
  const results = await Promise.all(promises)
  const successful = results.filter(r => r.success)
  if (successful.length === 0) {
    throw new Error('No successful connections')
  }
  return successful.reduce((fastest, current) =>
    !fastest || current.responseTime < fastest.responseTime ? current : fastest,
  )
}

// Create array of promises for both networks
const polkadotPromises = createProviderPromises(ahpProviders, 'Polkadot')
const kusamaPromises = createProviderPromises(kahpProviders, 'Kusama')

// Race to find fastest responding endpoints for both networks
Promise.all([
  getFastestSuccessful(polkadotPromises),
  getFastestSuccessful(kusamaPromises),
])
  .then(([polkadot, kusama]) => {
    const endpointsData = {
      ahp: {
        endpoint: polkadot.url,
        providers: ahpProviders,
        responseTime: polkadot.responseTime,
      },
      ahk: {
        endpoint: kusama.url,
        providers: kahpProviders,
        responseTime: kusama.responseTime,
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
