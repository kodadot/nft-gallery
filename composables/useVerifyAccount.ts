import { toSubstrateAddress } from '@/services/profile'
import { isEthereumAddress } from '@polkadot/util-crypto'

const SIGNATURE_MESSAGE = 'Verify ownership of this account on Koda'

const signMessage = async (address, message) => {
  const injector = await getAddress(toDefaultAddress(address))
  const signedMessage = await injector.signer.signRaw({
    address: address,
    data: message,
    type: 'bytes',
  })
  console.log('Signed message:', { message, address, signedMessage })
  return signedMessage.signature
}

export default function useVerifyAccount() {
  const walletStore = useWalletStore()
  const { accountId } = useAuth()
  const signedMessage = computed(() => walletStore.getSignedMessage)

  const getSignedMessage = async () => {
    if (!accountId.value || isEthereumAddress(accountId.value)) {
      // TODO: handle EVM address verification
      throw new Error('This address is not currently supported')
    }
    if (signedMessage.value) {
      return signedMessage.value
    }

    const signature = await signMessage(
      toSubstrateAddress(accountId.value),
      SIGNATURE_MESSAGE,
    )

    if (signature) {
      walletStore.setSignedMessage(signature)
      return signature
    }

    throw new Error('You have not completed address verification')
  }

  return {
    getSignedMessage,
  }
}
