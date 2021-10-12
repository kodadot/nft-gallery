import { Api } from '@subsocial/api/connections/substrate'
import { SubsocialIpfsApi } from '@subsocial/api/ipfs'
import { SubsocialApi } from '@subsocial/api/subsocial'
import { SubsocialSubstrateApi } from '@subsocial/api/substrate'
import ipfsConfig from './ipfsConfig'

export let subsocial: SubsocialApi
export let substrate: SubsocialSubstrateApi
export let ipfs: SubsocialIpfsApi

/**
 * Create a new or return existing connection to Subsocial API
 * (includes Substrate and IPFS connections).
 */
export const resolveSubsocialApi = async () => {
  // Connect to Subsocial's Substrate node:
  if (!subsocial) {
    const api = await Api.connect(process.env.VUE_APP_SUBSOCIAL_URL)
    subsocial = new SubsocialApi({
      substrateApi: api,
      ...ipfsConfig
    })

    substrate = subsocial.substrate
    ipfs = subsocial.ipfs
  }

  return subsocial
}
