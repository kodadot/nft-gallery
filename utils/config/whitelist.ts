import { toDefaultAddress } from '@/utils/account'

export const getRedirectToRmrk2HostnameWhitelist = () =>
  [
    'CuHWHNcBt3ASMVSJmcJyiBWGxxiWLyjYoYbGjfhL4ovoeSd',
    'H56NQrVAH4oyJPiYVqhTsA3uTcfAdcNaYtkfEGai9jyVnhE',
  ].map((address) => toDefaultAddress(address))
