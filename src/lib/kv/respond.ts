export default async function respond (rFetch: Response) {
  return JSON.parse(await rFetch.text())
}
