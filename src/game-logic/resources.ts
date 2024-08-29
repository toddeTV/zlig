/**
 * Determines the available resources.
 */
export type Resource = keyof {
  // This extracts all keys of the record class that are of type number.
  [K in keyof ResourceRecord as [ResourceRecord[K]] extends [number] ? K : never]: 0
}

type PlainResources = Record<Resource, number>

/**
 * A simple holder of all resources.
 *
 * A new resource can easily be added by adding a new field to this class. It will be automatically available on all
 * places. It is only important to give it an initial value of zero.
 */
export class ResourceRecord {
  readonly gold: number = 0

  constructor(init?: Partial<PlainResources>) {
    for (const [resource, amount] of getPlainResources(init ?? {})) {
      this[resource] = amount
    }
  }

  plus(other: ResourceRecord) {
    return this.calc(other, (a, b) => a + b)
  }

  minus(other: ResourceRecord) {
    return this.calc(other, (a, b) => a - b)
  }

  times(factor: number): ResourceRecord
  times(factors: Partial<PlainResources>): ResourceRecord
  times(factorOrFactors: number | Partial<PlainResources>) {
    if (typeof factorOrFactors === 'number') {
      // This is a shortcut: Pretend to calculate with an empty record but multiplicate each value with the fixed value.
      return this.calc(new ResourceRecord(), a => a * factorOrFactors)
    }

    // This is another shortcut: This time actually fill the record and use it for multiplication.
    return this.calc(new ResourceRecord(factorOrFactors), (a, b) => a * b)
  }

  divided_by(divisor: number): ResourceRecord
  divided_by(divisors: Partial<PlainResources>): ResourceRecord
  divided_by(divisorOrDivisors: number | Partial<PlainResources>) {
    if (typeof divisorOrDivisors === 'number') {
      // This is a shortcut: Pretend to calculate with an empty record but divide each value by the fixed value.
      return this.calc(new ResourceRecord(), a => a / divisorOrDivisors)
    }

    // This is another shortcut: This time actually fill the record and use it for division.
    return this.calc(new ResourceRecord(divisorOrDivisors), (a, b) => a / b)
  }

  /**
   * @returns A record with only integer values.
   */
  round() {
    // Another shortcut: Pretend to calculate but only use the value of this record.
    return this.calc(new ResourceRecord(), a => Math.floor(a))
  }

  private calc(other: ResourceRecord, op: (a: number, b: number) => number) {
    // This does not return functions.
    const resources = Object.assign({}, this as PlainResources)

    for (const [resource, amount] of getPlainResources(other)) {
      resources[resource] = op(resources[resource], amount)
    }

    return new ResourceRecord(resources)
  }
}

function getPlainResources(input: Partial<PlainResources>) {
  return Object.entries(input) as [Resource, number][]
}
