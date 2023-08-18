import type { Source } from '$lib'


export type SearchResponse = {
  quotes?: Source[]
  sourcesByTitle?: Source[]
  sourcesByDescription?: Source[]
}
