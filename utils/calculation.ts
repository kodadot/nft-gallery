export function calculateUsdFromToken(amount: number, price: number): number {
  return Math.floor(amount * price * 100) / 100
}

export function calculateExactUsdFromToken(
  token: number,
  price: number,
): number {
  return Number((token * price).toFixed(2))
}

export function calculateTokenFromUsd(tokenPrice: number, usd: number): number {
  return Math.ceil((usd / tokenPrice) * 10000) / 10000
}

// function includes the lower bound, but excludes the upper bound
export function randomIntegerBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min
}
