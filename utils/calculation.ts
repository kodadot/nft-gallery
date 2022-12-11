export function calculateUsdFromKsm(ksm: number, price: number): number {
  return Number(Math.ceil(ksm * price))
}

export function calculateExactUsdFromKsm(ksm: number, price: number): number {
  return Number((ksm * price).toFixed(2))
}

export function calculateKsmFromUsd(ksm: number, usd: number): number {
  return Math.ceil((usd / ksm) * 100) / 100
}

// function includes the lower bound, but excludes the upper bound
export function randomIntegerBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min
}
