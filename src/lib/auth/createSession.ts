import { add } from '$lib/auth/sessions'
import createAccessAndRefreshExpirationDates from '$lib/auth/createAccessAndRefreshExpirationDates'


export default async function createSession (userId: number, ipAddress: string): Promise<number | undefined> {
  const { accessExpiration, refreshExpiration } = createAccessAndRefreshExpirationDates()

  return await add({
    ipAddress,
    user: { id: userId },
    accessExpiration: accessExpiration.toISOString(),
    refreshExpiration: refreshExpiration.toISOString(),
  })
}
