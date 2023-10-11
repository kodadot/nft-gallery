import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'

const HOST_APP_NAME = 'KodaDot'
const HOST_LOGO_URL = 'https://kodadot.xyz/apple-touch-icon.png'

interface InitRampParams {
  address: string
  onSuccess?: () => void
  defaultAsset?: string
  showAfterInit?: boolean
}

export default function useRamp() {
  const config = useRuntimeConfig()
  const { $consola } = useNuxtApp()

  const rampInstant = ref<RampInstantSDK | null>(null)
  const rampApiKey = config.public.rampApiKey

  const init = (params: InitRampParams) => {
    const { address, defaultAsset = 'KSM', onSuccess } = params

    try {
      rampInstant.value = new RampInstantSDK({
        defaultAsset,
        userAddress: address,
        hostAppName: HOST_APP_NAME,
        hostApiKey: rampApiKey,
        hostLogoUrl: HOST_LOGO_URL,
        variant: 'desktop',
      })

      rampInstant.value.on('PURCHASE_CREATED', () => {
        if (onSuccess) {
          onSuccess()
        }
      })

      rampInstant.value.show()
    } catch (e) {
      $consola.error('[RAMP SDK] Error initializing RampInstantSDK:', e)
    }
  }

  return {
    init,
  }
}
