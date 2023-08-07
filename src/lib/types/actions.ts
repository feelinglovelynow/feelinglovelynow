import type { Source } from '$lib/types/all'


export type SearchResponse = {
  quotes?: Source[]
  sourcesByTitle?: Source[]
  sourcesByDescription?: Source[]
}
