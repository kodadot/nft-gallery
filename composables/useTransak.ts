import type { Prefix } from '@kodadot1/static'
import transakSDK from '@transak/transak-sdk'

type InitTransakParams = {
  address: string
  onSuccess?: (data) => void
}

export default function useTransak() {
  const config = useRuntimeConfig()
  const { urlPrefix } = usePrefix()

  const getChainConfig = (prefix: Prefix) => {
    return ({
      base: { currency: 'ETH', network: 'base' },
      ahp: { currency: 'DOT', network: 'mainnet' },
      ahk: { currency: 'KSM', network: 'mainnet' },
      ksm: { currency: 'KSM', network: 'mainnet' },
    } as Record<Prefix, { currency: string, network: string }>)[prefix]
  }

  const init = ({ address, onSuccess }: InitTransakParams) => {
    const { currency, network } = getChainConfig(urlPrefix.value)

    const transak = new transakSDK({
      apiKey: config.public.transakApiKey,
      environment: config.public.transakEnvironment,
      widgetHeight: '100%',
      defaultCryptoCurrency: currency,
      defaultNetwork: network,
      walletAddress: toChainAddres(address, urlPrefix.value),
    })

    transak.init()

    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      if (onSuccess) {
        onSuccess(orderData)
      }
      transak.close()
    })
  }

  return {
    init,
  }
}
