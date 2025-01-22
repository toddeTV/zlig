import Big from 'big.js'

export class Duration {
  private constructor(readonly milliseconds: Big) {}

  static fromDates(start: Date, end: Date): Duration {
    return new this(new Big(end.getTime() - start.getTime()))
  }

  static fromSeconds(seconds: number | Big): Duration {
    return new this((typeof seconds === 'number' ? new Big(seconds) : seconds).times(1000))
  }

  static fromMinutes(minutes: Big): Duration {
    return new this(minutes.times(1000 * 60))
  }

  static fromHours(hours: Big): Duration {
    return new this(hours.times(1000 * 60 * 60))
  }

  static fromDays(days: Big): Duration {
    return new this(days.times(1000 * 60 * 60 * 24))
  }

  plus(other: this): Duration {
    return new Duration(this.milliseconds.plus(other.milliseconds))
  }

  minus(other: this): Duration {
    return new Duration(this.milliseconds.minus(other.milliseconds))
  }

  times(other: number): Duration {
    return new Duration(this.milliseconds.times(other))
  }

  format(): string {
    const milliseconds = this.milliseconds.mod(1000)

    const seconds_ = this.milliseconds.minus(milliseconds).div(1000)
    const seconds = seconds_.mod(60)

    const minutes_ = seconds_.minus(seconds).div(60)
    const minutes = minutes_.mod(60)

    const hours_ = minutes_.minus(minutes).div(60)
    const hours = hours_.mod(24)

    const days = hours_.minus(hours).div(24)

    const parts = [
      [days, 'd'],
      [hours, 'h'],
      [minutes, 'm'],
    ] as const

    const idxOfFirstPartToPrint = parts.findIndex(([val]) => val.gt(0))

    const partsToPrint = parts.slice(idxOfFirstPartToPrint)

    return partsToPrint.map(([val, suffix]) => `${val.toNumber().toLocaleString()}${suffix}`).join(' ')
  }
}
