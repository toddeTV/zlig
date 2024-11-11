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
  asPlain(): PlainResources {
    return { ...this }
  }

  plus(other: Partial<PlainResources>): ResourceRecord {
    return this.calc(other, (a, b) => a.plus(b))
  }

  minus(other: Partial<PlainResources>): ResourceRecord {
    return this.calc(other, (a, b) => a.minus(b))
  }

  times(factor: number): ResourceRecord
  times(factors: Partial<PlainResources>): ResourceRecord
  times(factorOrFactors: number | Partial<PlainResources>) {
    if (typeof factorOrFactors === 'number') {
      // This is a shortcut: Pretend to calculate with empty resources but multiplicate each value with the fixed value.
      return this.calc({}, a => a.times(factorOrFactors))
    }

    // This is another shortcut: This time actually fill the record and use it for multiplication.
    return this.calc(factorOrFactors, (a, b) => a.times(b))
  }

  divided_by(divisor: number): ResourceRecord
  divided_by(divisors: Partial<PlainResources>): ResourceRecord
  divided_by(divisorOrDivisors: number | Partial<PlainResources>) {
    if (typeof divisorOrDivisors === 'number') {
      // This is a shortcut: Pretend to calculate with empty resources but divide each value by the fixed value.
      return this.calc({}, a => a.div(divisorOrDivisors))
    }

    // This is another shortcut: This time actually fill the record and use it for division.
    return this.calc(divisorOrDivisors, (a, b) => a.div(b))
  }

  gt(other: Partial<PlainResources>): boolean {
    return this.cmp(other, (a, b) => a.gt(b))
  }

  gte(other: Partial<PlainResources>): boolean {
    return this.cmp(other, (a, b) => a.gte(b))
  }

  lt(other: Partial<PlainResources>): boolean {
    return this.cmp(other, (a, b) => a.lt(b))
  }

  lte(other: Partial<PlainResources>): boolean {
    return this.cmp(other, (a, b) => a.lte(b))
  }

  /**
   * @returns A record with only integer values.
   */
  round(): ResourceRecord {
    // Another shortcut: Pretend to calculate but only use the value of this record.
    return this.calc({}, a => a.round(0, Big.roundHalfUp))
  }

  /**
   * @returns A record with only integer values (rounded down).
   */
  roundDown(): ResourceRecord {
    // Another shortcut: Pretend to calculate but only use the value of this record.
    return this.calc({}, a => a.round(0, Big.roundDown))
  }

  /**
   * This helper method applies the op to each pair of resources from this and the other and collects the result in a
   * new resource record.
   */
  private calc(other: Partial<PlainResources>, op: (a: Big, b: Big) => Big) {
    const resources = getPlainResources(this)
    const resourcesOther = { ...other }

    for (const [resource, amountThis] of resources) {
      const amountOther = resourcesOther[resource] ?? ZERO

      resourcesOther[resource] = op(amountThis, amountOther)
    }

    return new ResourceRecord(resourcesOther)
  }

  private cmp(other: Partial<PlainResources>, cmp: (a: Big, b: Big) => boolean) {
    const resources = getPlainResources(this)

    for (const [resource, amountThis] of resources) {
      const amountOther = other[resource]

      if (!amountOther || !cmp(amountThis, amountOther)) {
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

export class ResourcesPerMillisecond extends ResourceRecord {
  perHour() {
    return this.times(1000 * 60 * 60)
  }
}

export function resourcesPerSecond(resources: Partial<PlainResources>): ResourcesPerMillisecond {
  resources = record(resources).divided_by(1000)

  return new ResourcesPerMillisecond(resources)
}

export function resourcesPerMinute(resources: Partial<PlainResources>): ResourcesPerMillisecond {
  resources = record(resources).divided_by(1000 * 60)

  return new ResourcesPerMillisecond(resources)
}

export function resourcesPerHour(resources: Partial<PlainResources>): ResourcesPerMillisecond {
  resources = record(resources).divided_by(1000 * 60 * 60)

  return new ResourcesPerMillisecond(resources)
}

export function resourcesPerDay(resources: Partial<PlainResources>): ResourcesPerMillisecond {
  resources = record(resources).divided_by(1000 * 60 * 60 * 24)

  return new ResourcesPerMillisecond(resources)
}

function record(resources: Partial<PlainResources>) {
  if (resources instanceof ResourceRecord) {
    return resources
  }
  return new ResourceRecord(resources)
}
