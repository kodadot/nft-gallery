function simpleMultiply(value: string | number, decimals = 0): string {
  return (BigInt(value) * BigInt(10 ** decimals)).toString()
}

function magic(input: number | string, decimals = 12): string {
  validateInput(input)
  const value = String(input)
  const isDecimalValue = value.match(/^(\d+)\.(\d+)$/)
  if (isDecimalValue) {
    const [, whole, fraction] = isDecimalValue
    if (fraction.length > decimals) {
      throw new RangeError(
        `Fractional part is too long: ${fraction.length} > ${decimals}`
      )
    }

    return simpleMultiply(whole + fraction, decimals - fraction.length)
  }

  return simpleMultiply(value, decimals)
}

function validateInput(input: number | string): void {
  const value = Number(input)
  if (Number.isNaN(value)) {
    throw new Error('[BALANCE] Value has to be a number')
  }

  if (value < 0) {
    throw new RangeError('[BALANCE] Value has to be positive')
  }
}

// function verySimpleMagic(input: number | string, decimals = 12): string {
//   validateInput(input)

//   const value = Number(input).toPrecision(decimals)
//   return simpleMultiply(value, decimals)
// }

describe('Balance Magic', (): void => {
  it('should return correct value', () => {
    const input = 9
    const result = magic(input, 12)
    expect(result).toBe('9000000000000')
  })
  it('should process number with 2 decimal places', () => {
    const input = 9
    const result = magic(input, 2)
    expect(result).toBe('900')
  })
  it('should process float with 2 decimal places', () => {
    const input = 9.25
    const result = magic(input, 2)
    expect(result).toBe('925')
  })
  it('should process number with 0 decimal places', () => {
    const input = 9
    const result = magic(input, 0)
    expect(result).toBe('9')
  })
  it('should return correct value on floats', () => {
    const input = 9.123231812341
    const result = magic(input, 12)
    expect(result).toBe('9123231812341')
  })
  it('should throw when the number has more that decimal places', () => {
    const input = 9.1232318123412
    const call = () => magic(input, 12)
    expect(call).toThrowError(RangeError)
  })
  it('should throw when there is float instead of number', () => {
    const input = 9.1
    const call = () => magic(input, 0)
    expect(call).toThrowError(RangeError)
  })
  it('should throw on negative numbers', () => {
    const input = -9.1232318
    const call = () => magic(input, 12)
    expect(call).toThrowError(RangeError)
  })
  it('should throw on NaNs', () => {
    const input = '9.123.134'
    const call = () => magic(input, 12)
    expect(call).toThrowError(Error)
  })
  // it('should return simple value', () => {
  //   const input = 9.123231812341
  //   const result = verySimpleMagic(input, 12)
  //   expect(result).toBe('9123231812341')
  // })
  // it('should return shortened value even if the input is longer', () => {
  //   const input = 9.1232318123412
  //   const result = verySimpleMagic(input, 12)
  //   expect(result).toBe('9123231812341')
  // })
})
