import { twoDecimalPlaces } from '$lib/store/twoDecimalPlaces'


export default class Price {
  num: number
  str: string

  constructor (num: number = 0) {
    this.num = num || 0
    this.str = twoDecimalPlaces(num)
  }

  add (additional: number) { // add to the current num and update the str
    this.num += additional
    this.str = twoDecimalPlaces(this.num)
  }
}
