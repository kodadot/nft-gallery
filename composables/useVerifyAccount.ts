import { isEthereumAddress } from '@polkadot/util-crypto'
import { signMessage as signMessageEvm } from '@wagmi/core'

const signMessagePolkadot = async (address: string, message: string) => {
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

  const signMessageEthereum = async (address: string, message: string) => {
    const signedMessage = await signMessageEvm(wagmiConfig, {
      account: address as `0x${string}`,
      message: message,
    })

    console.log('Signed evm message:', { message, address, signedMessage })
    return signedMessage
  }

  const getSignedMessage = async () => {
    if (!accountId.value) {
      throw new Error('Please connect your wallet first')
    }
    if (signedMessage.value) {
      return signedMessage.value
    }

    const signMessageFn = isEthereumAddress(accountId.value)
      ? signMessageEthereum
      : signMessagePolkadot
    const signature = await signMessageFn(accountId.value, SIGNATURE_MESSAGE)

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
