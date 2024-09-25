// todo: const isArtGenDomain = ['koda.art'].includes(
// window.location.hostname,
// )
export const isArtGenDomain = location.hostname.startsWith('deploy-preview-') || ['koda.art', 'localhost'].includes(
  window.location.hostname,
)

export const isProduction = ['kodadot.xyz', 'koda.art'].includes(
  window.location.hostname,
)
export const isBeta = ['beta.kodadot.xyz', 'beta.koda.art'].includes(
  window.location.hostname,
)
