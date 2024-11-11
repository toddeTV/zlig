import Big from 'big.js'

/**
 * Determines the available resources.
 */
export type Resource = keyof {
  // This extracts all keys of the record class that are of the custom big integer type.
  [K in keyof ResourceRecord as [ResourceRecord[K]] extends [Big] ? K : never]: 0
}

export type PlainResources = Record<Resource, Big>

const ZERO = new Big('0')

/**
 * A simple holder of all resources.
 *
 * A new resource can easily be added by adding a new field to this class. It will be automatically available on all
 * places. It is only important to give it an initial value of zero.
 */
export class ResourceRecord implements PlainResources {
  readonly gold: Big = ZERO

  constructor(init?: Partial<PlainResources>) {
    for (const [resource, amount] of getPlainResources(init ?? {})) {
      this[resource] = amount
    }
  }

  /**
   * Returns the plain resources object.
   */
  asPlain() {
    return Object.fromEntries(getPlainResources(this)) as PlainResources
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

  gt(other: ResourceRecord): boolean {
    return this.cmp(other, (a, b) => a.gt(b))
  }

  gte(other: ResourceRecord): boolean {
    return this.cmp(other, (a, b) => a.gte(b))
  }

  lt(other: ResourceRecord): boolean {
    return this.cmp(other, (a, b) => a.lt(b))
  }

  lte(other: ResourceRecord): boolean {
    return this.cmp(other, (a, b) => a.lte(b))
  }

  /**
   * @returns A record with only integer values.
   */
  round() {
    // Another shortcut: Pretend to calculate but only use the value of this record.
    return this.calc(new ResourceRecord(), a => a.round(0, Big.roundHalfUp))
  }

  /**
   * @returns A record with only integer values (rounded down).
   */
  roundDown() {
    // Another shortcut: Pretend to calculate but only use the value of this record.
    return this.calc(new ResourceRecord(), a => a.round(0, Big.roundDown))
  }

  /**
   * This helper method applies the op to each pair of resources from this and the other and collects the result in a
   * new resource record.
   */
  private calc(other: ResourceRecord, op: (a: Big, b: Big) => Big) {
    const resourcesThis = this.asPlain()
    const resourcesOther = getPlainResources(other)

    for (const [resource, amountOther] of resourcesOther) {
      const amountThis = resourcesThis[resource]

      resourcesThis[resource] = op(amountThis, amountOther)
    }

    return new ResourceRecord(resourcesThis)
  }

  private cmp(other: ResourceRecord, cmp: (a: Big, b: Big) => boolean) {
    const resourcesThis = this.asPlain()
    const resourcesOther = getPlainResources(other)

    for (const [resource, amountOther] of resourcesOther) {
      const amountThis = resourcesThis[resource]

      if (!cmp(amountThis, amountOther)) {
        return false
      }
    }

    return true
  }
}

function getPlainResources(input: Partial<PlainResources>) {
  // This does not return functions.
  return Object.entries(input) as [Resource, Big][]
}
