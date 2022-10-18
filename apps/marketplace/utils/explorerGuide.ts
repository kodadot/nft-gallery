export const urlBuilderTransaction = (
  value: string,
  blockExplorer: string
): string => {
  // e.g https://kusama.subscan.io/extrinsic/0xbad28463be97b63443de249dada01683a5ee7b48a509c1c0b0e51ae93ab707a1
  return `${blockExplorer}extrinsic/${value}`
}
