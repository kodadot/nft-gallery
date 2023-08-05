import bsxToken from '@/assets/token/bsx.svg'
import dotToken from '@/assets/token/dot.svg'
import ksmToken from '@/assets/token/ksm.svg'

export const useIcon = () => {
  const getTokenIconBySymbol = (token: string) => {
    switch (token.toLowerCase()) {
      case 'bsx':
        return bsxToken
      case 'dot':
        return dotToken
      case 'ksm':
        return ksmToken
      default:
        return ksmToken
    }
  }

  return { getTokenIconBySymbol }
}
