export const isLatestProductionDomain = window.location.hostname === 'koda.art'

export const isProduction = ['kodadot.xyz', 'koda.art'].includes(
  window.location.hostname,
)
export const isBeta = ['beta.kodadot.xyz', 'beta.koda.art'].includes(
  window.location.hostname,
)
