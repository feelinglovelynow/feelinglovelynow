export default function log (actions: any[]): void {
  for (const action of actions) {
    if (action === 'trace') console.trace()
    else console.log(action)
  }
}