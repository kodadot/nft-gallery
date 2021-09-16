export function calculateUsdFromKsm(ksm: number, price: number): number {
  return Number(Math.ceil(ksm * price));
}

export function calculateKsmFromUsd(ksm: number, usd: number): number {
  return Math.ceil((usd / ksm) * 100) / 100;
}
