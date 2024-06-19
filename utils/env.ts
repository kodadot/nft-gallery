export const isProduction = ['kodadot.xyz', 'koda.art'].includes(
  window.location.hostname,
)
export const isBeta = window.location.hostname === 'beta.kodadot.xyz'
