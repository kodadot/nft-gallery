import { Ref, ref } from 'vue'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import { AllWidgetVariants } from '@ramp-network/ramp-instant-sdk/dist/types/types'
import consola from 'consola'

const HOST_APP_NAME = 'KodaDot'
const HOST_LOGO_URL = 'https://kodadot.xyz/apple-touch-icon.png'

interface InitRampParams {
  address: string
  defaultAsset: string
  variant?: AllWidgetVariants
  showAfterInit?: boolean
}

export default function useRamp() {
  const rampInstant: Ref<RampInstantSDK | null> = ref(null)
  const config = useRuntimeConfig()
  const rampApiKey = config.public.rampApiKey

  const initRampInstant = (params: InitRampParams) => {
    const {
      address,
      defaultAsset,
      variant = 'desktop',
      showAfterInit = true,
    } = params

    try {
      rampInstant.value = new RampInstantSDK({
        defaultAsset,
        userAddress: address,
        hostAppName: HOST_APP_NAME,
        hostApiKey: rampApiKey,
        hostLogoUrl: HOST_LOGO_URL,
        variant,
      })

      if (showAfterInit) {
        rampInstant.value.show()
      }
    } catch (e) {
      consola.error('[RAMP SDK] Error initializing RampInstantSDK:', e)
    }
  }

  return {
    initRampInstant,
  }
}
