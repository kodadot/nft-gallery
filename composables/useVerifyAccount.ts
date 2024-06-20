import { toSubstrateAddress } from '@/services/profile'
import { isEthereumAddress } from '@polkadot/util-crypto'
import { signMessage as _signMessageEvm } from '@wagmi/core'

const signMessagePolkadot = async (address, message) => {
  const injector = await getAddress(toDefaultAddress(address))
  const signedMessage = await injector.signer.signRaw({
    address: address,
    data: message,
    type: 'bytes',
  })
  console.log('Signed polkadot message:', { message, address, signedMessage })
  return signedMessage.signature
}

export const SIGNATURE_MESSAGE = 'Verify ownership of this account on Koda'

export default function useVerifyAccount() {
  const walletStore = useWalletStore()
  const { accountId } = useAuth()
  const signedMessage = computed(() => walletStore.getSignedMessage)
  const { config: wagmiConfig } = useWagmi()

  const signMessageEvm = async (address, message) => {
    const signedMessage = await _signMessageEvm(wagmiConfig, {
      account: address,
      message: message,
    })

    console.log('Signed evm message:', { message, address, signedMessage })
    return signedMessage
  }

  const getSignedMessage = async () => {
    const isEvmAddress = isEthereumAddress(accountId.value)

    if (!accountId.value) {
      // TODO: handle EVM address verification
      throw new Error('This address is not currently supported')
    }
    if (signedMessage.value) {
      return signedMessage.value
    }

    const signature = isEvmAddress
      ? await signMessageEvm(accountId.value, SIGNATURE_MESSAGE)
      : await signMessagePolkadot(
          toSubstrateAddress(accountId.value),
          SIGNATURE_MESSAGE,
        )

    if (signature) {
      walletStore.setSignedMessage(signature)
      return signature
    }

    throw new Error('You have not completed address verification')
  }

  const getSignaturePair = async () => {
    const signature = await getSignedMessage()
    return {
      signature,
      message: SIGNATURE_MESSAGE,
    }
  }

  return {
    getSignaturePair,
  }
}
