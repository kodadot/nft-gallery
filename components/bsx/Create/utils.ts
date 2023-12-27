export type Token = 'DOT' | 'KSM'

export const getBalance = (_token?: Token): number => {
  const { balance } = useAuth()

  return Number(balance.value)
}
