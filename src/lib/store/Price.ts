import { twoDecimalPlaces } from '$lib/store/twoDecimalPlaces'


export default class Price {
  num: number
  str: string

  constructor (value?: string | number) {
    let num = 0

    if (typeof value === 'string') num = Number(value) || 0
    if (typeof value === 'number') num = value || 0

    this.num = num
    this.str = twoDecimalPlaces(num)
  }

  add (additional: number) { // add to the current num and update the str
    this.num += additional
    this.str = twoDecimalPlaces(this.num)
  }
}
