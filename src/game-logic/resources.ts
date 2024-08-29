import Big from 'big.js'

/**
 * Determines the available resources.
 */
export type Resource = keyof {
  // This extracts all keys of the record class that are of type number.
  [K in keyof ResourceRecord as [ResourceRecord[K]] extends [Big] ? K : never]: 0
}

type PlainResources = Record<Resource, Big>

const ZERO = new Big('0')

/**
 * A simple holder of all resources.
 *
 * A new resource can easily be added by adding a new field to this class. It will be automatically available on all
 * places. It is only important to give it an initial value of zero.
 */
export class ResourceRecord {
  readonly gold: Big = ZERO

  constructor(init?: Partial<PlainResources>) {
    for (const [resource, amount] of getPlainResources(init ?? {})) {
      this[resource] = amount
    }
  }

  plus(other: ResourceRecord) {
    return this.calc(other, (a, b) => a.plus(b))
  }

  minus(other: ResourceRecord) {
    return this.calc(other, (a, b) => a.minus(b))
  }

  times(factor: number): ResourceRecord
  times(factors: Partial<PlainResources>): ResourceRecord
  times(factorOrFactors: number | Partial<PlainResources>) {
    if (typeof factorOrFactors === 'number') {
      // This is a shortcut: Pretend to calculate with an empty record but multiplicate each value with the fixed value.
      return this.calc(new ResourceRecord(), a => a.times(factorOrFactors))
    }

    // This is another shortcut: This time actually fill the record and use it for multiplication.
    return this.calc(new ResourceRecord(factorOrFactors), (a, b) => a.times(b))
  }

  divided_by(divisor: number): ResourceRecord
  divided_by(divisors: Partial<PlainResources>): ResourceRecord
  divided_by(divisorOrDivisors: number | Partial<PlainResources>) {
    if (typeof divisorOrDivisors === 'number') {
      // This is a shortcut: Pretend to calculate with an empty record but divide each value by the fixed value.
      return this.calc(new ResourceRecord(), a => a.div(divisorOrDivisors))
    }

    // This is another shortcut: This time actually fill the record and use it for division.
    return this.calc(new ResourceRecord(divisorOrDivisors), (a, b) => a.div(b))
  }

  /**
   * @returns A record with only integer values.
   */
  round() {
    // Another shortcut: Pretend to calculate but only use the value of this record.
    return this.calc(new ResourceRecord(), a => a.round(0, 0))
  }

  private calc(other: ResourceRecord, op: (a: Big, b: Big) => Big) {
    // This does not return functions.
    const resources = Object.assign({}, this as PlainResources)

    for (const [resource, amount] of getPlainResources(other)) {
      resources[resource] = op(resources[resource], amount)
    }

    return new ResourceRecord(resources)
  }
}

function getPlainResources(input: Partial<PlainResources>) {
  return Object.entries(input) as [Resource, Big][]
}
