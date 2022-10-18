import { isSameAccount } from '../account'

export const isLoggedIn = (accountId: string): boolean => {
  return !!accountId
}

export const isForSale = (price: string): boolean => {
  return parseInt(price) > 0
}

export const isAvailableToBuy = (accountId: string, price: string): boolean => {
  return isLoggedIn(accountId) && isForSale(price)
}

export const isOwner = (accountId: string, owner: string): boolean => {
  return Boolean(
    isLoggedIn(accountId) &&
      isLoggedIn(owner) &&
      isSameAccount(accountId, owner)
  )
}
