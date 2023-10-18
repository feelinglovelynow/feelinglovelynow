export function twoDecimalPlaces (num: number = 0) {
  return (Math.round(num * 100) / 100).toFixed(2)
}
