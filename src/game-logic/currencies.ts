/**
 * Determines the available currencies.
 */
export type Currency = keyof {
  // This extracts all keys of the record class that are of type number.
  [K in keyof CurrencyRecord as [CurrencyRecord[K]] extends [number] ? K : never]: 0
}

type PlainCurrencies = Record<Currency, number>

/**
 * A simple holder of all currencies.
 */
export class CurrencyRecord {
  readonly gold: number = 0

  constructor(init?: Partial<PlainCurrencies>) {
    for (const [currency, amount] of getPlainCurrencies(init ?? {})) {
      this[currency] = amount
    }
  }

  plus(other: CurrencyRecord) {
    return this.calc(other, (a, b) => a + b)
  }

  minus(other: CurrencyRecord) {
    return this.calc(other, (a, b) => a - b)
  }

  times(factor: number): CurrencyRecord
  times(factors: Partial<PlainCurrencies>): CurrencyRecord
  times(factorOrFactors: number | Partial<PlainCurrencies>) {
    if (typeof factorOrFactors === 'number') {
      // This is a shortcut: Pretend to calculate with an empty record but multiplicate each value with the fixed value.
      return this.calc(new CurrencyRecord(), a => a * factorOrFactors)
    }

    // This is another shortcut: This time actually fill the record and use it for multiplication.
    return this.calc(new CurrencyRecord(factorOrFactors), (a, b) => a * b)
  }

  divided_by(divisor: number): CurrencyRecord
  divided_by(divisors: Partial<PlainCurrencies>): CurrencyRecord
  divided_by(divisorOrDivisors: number | Partial<PlainCurrencies>) {
    if (typeof divisorOrDivisors === 'number') {
      // This is a shortcut: Pretend to calculate with an empty record but divide each value by the fixed value.
      return this.calc(new CurrencyRecord(), a => a / divisorOrDivisors)
    }

    // This is another shortcut: This time actually fill the record and use it for division.
    return this.calc(new CurrencyRecord(divisorOrDivisors), (a, b) => a / b)
  }

  private calc(other: CurrencyRecord, op: (a: number, b: number) => number) {
    // This does not return functions.
    const currencies = Object.assign({}, this as PlainCurrencies)

    for (const [currency, amount] of getPlainCurrencies(other)) {
      currencies[currency] = op(currencies[currency], amount)
    }

    return new CurrencyRecord(currencies)
  }
}

function getPlainCurrencies(input: Partial<PlainCurrencies>) {
  return Object.entries(input) as [Currency, number][]
}
