import { add } from '$lib/auth/sessions'
import createAccessAndRefreshExpirationDates from '$lib/auth/createAccessAndRefreshExpirationDates'


export default async function createSession (userUid: string, ipAddress: string): Promise<string> {
  const { accessExpiration, refreshExpiration } = createAccessAndRefreshExpirationDates()

  return await add({
    ipAddress,
    user: { uid: userUid },
    accessExpiration: accessExpiration.toISOString(),
    refreshExpiration: refreshExpiration.toISOString(),
  })
}
