export type PrintfulError = {
  reason: string,
  message: string
}


export type PrintfulProducts = {
  code: number,
  error?: PrintfulError,
  result: string | {
    id: number,
    external_id: string,
    name: string,
    variants: number,
    synced: number,
    thumbnail_url: string,
    is_ignored: boolean
  }[],
}
