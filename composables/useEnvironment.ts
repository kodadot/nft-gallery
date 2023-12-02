export default function () {
  const { hostname } = useRequestURL()

  return {
    isProduction: hostname === 'kodadot.xyz',
    isBeta: hostname === 'beta.kodadot.xyz',
  }
}
