import transakSDK from '@transak/transak-sdk'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { CHAINS } from '@kodadot1/static'

interface InitParams {
  address: string
  onSuccess?: (data) => void
}

const getKsmAddress = (address: string) => {
  const publicKey = decodeAddress(address)
  return encodeAddress(publicKey, CHAINS['ksm'].ss58Format)
}

export default function useTransak() {
  const config = useRuntimeConfig()

  const init = ({ address, onSuccess }: InitParams) => {
    const transak = new transakSDK({
      apiKey: config.public.transakApiKey,
      environment: config.public.transakEnvironment,
      widgetHeight: '100%',
      defaultCryptoCurrency: 'KSM',
      walletAddress: getKsmAddress(address),
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
