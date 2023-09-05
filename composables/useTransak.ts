import transakSDK from '@transak/transak-sdk'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { CHAINS } from '~~/libs/static/dist'

interface InitParams {
  address: string
  onSuccess?: (data) => void
  onClose?: (data) => void
}

const getKsmAddress = (address: string) => {
  const publicKey = decodeAddress(address)
  return encodeAddress(publicKey, CHAINS['ksm'].ss58Format)
}

export default function useTransak() {
  const config = useRuntimeConfig()

  const init = ({ address, onSuccess, onClose }: InitParams) => {
    const transak = new transakSDK({
      apiKey: config.public.transakApiKey,
      environment: config.public.transakEnvironment,
      widgetHeight: '70%',
      defaultCryptoCurrency: 'KSM',
      walletAddress: getKsmAddress(address),
    })

    transak.init()

    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      if (onClose) {
        onClose(orderData)
      }
      transak.close()
    })

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
