import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import type { Prefix } from '@kodadot1/static'

const HOST_APP_NAME = 'KodaDot'
const HOST_LOGO_URL = 'https://kodadot.xyz/apple-touch-icon.png'

export type OnRampAsset = { token: string, network: Prefix }

type InitRampParams = {
  address: string
  onSuccess?: () => void
  showAfterInit?: boolean
}

export default function useRamp() {
  const config = useRuntimeConfig()
  const { $consola } = useNuxtApp()
  const { urlPrefix } = usePrefix()

  const rampInstant = ref<RampInstantSDK | null>(null)
  const rampApiKey = config.public.rampApiKey

  const getAsset = (prefix: Prefix) => {
    return ({
      base: 'BASE_ETH',
      ahp: 'DOT_DOT',
      ahk: 'KUSAMA_KSM',
      ksm: 'KUSAMA_KSM',
    } as Record<Prefix, string>)[prefix]
  }

  const init = ({ address, onSuccess }: InitRampParams) => {
    try {
      rampInstant.value = new RampInstantSDK({
        defaultAsset: getAsset(urlPrefix.value),
        userAddress: toChainAddres(address, urlPrefix.value),
        hostAppName: HOST_APP_NAME,
        hostApiKey: rampApiKey,
        hostLogoUrl: HOST_LOGO_URL,
        variant: 'auto',
      })

      rampInstant.value.on('PURCHASE_CREATED', () => {
        if (onSuccess) {
          onSuccess()
        }
      })

      rampInstant.value.show()
    }
    catch (e) {
      $consola.error('[RAMP SDK] Error initializing RampInstantSDK:', e)
    }
  }

  return {
    init,
  }
}
