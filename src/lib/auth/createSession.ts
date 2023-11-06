import type { Session } from '$lib'
import { add } from '$lib/auth/sessions'
import createAccessAndRefreshExpirationDates from '$lib/auth/createAccessAndRefreshExpirationDates'


export default async function createSession (userId: string, platform: Readonly<App.Platform> | undefined, ipAddress: string): Promise<Session> {
  const { accessExpiration, refreshExpiration } = createAccessAndRefreshExpirationDates()
  const session = {
    id: crypto.randomUUID(),
    user: { id: userId },
    ipAddress,
    accessExpiration: accessExpiration.toISOString(),
    refreshExpiration: refreshExpiration.toISOString(),
  }

  return await add(session)
}
