export default async function respond (rFetch: Response) {
  try {
    return await rFetch.json()
  } catch (e) {
    return null
  }
}
