import { log, many, one } from '$lib/catch/error'
import { dgraph as _dgraph } from '$lib/global/dgraph'
import { DgraphTransaction } from '$lib/global/dgraph'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import type { DgraphResponse } from '$lib/global/dgraph'
import { DGRAPH_CLOUD_URL, DGRAPH_CLOUD_API_KEY, DGRAPH_CLOUD_URL_QA, DGRAPH_CLOUD_API_KEY_QA } from '$env/static/private'


export function txn ({ readOnly, bestEffort, pointMain }: { readOnly?: boolean, bestEffort?: boolean, pointMain?: boolean }): DgraphTransaction {
  const params = pointMain || PUBLIC_ENVIRONMENT === 'main' ?
    { endpoint: DGRAPH_CLOUD_URL, apiKey: DGRAPH_CLOUD_API_KEY } :
    { endpoint: DGRAPH_CLOUD_URL_QA, apiKey: DGRAPH_CLOUD_API_KEY_QA }

  return new DgraphTransaction({ endpoint: params.endpoint, apiKey: params.apiKey, readOnly, bestEffort })
}


export async function dgraph ({ query, mutation, remove, transaction, commitNow, readOnly, bestEffort, discardTxn }: DgraphOptions): Promise<DgraphResponse> {
  transaction = transaction ? transaction : txn({ readOnly, bestEffort })

  let r

  try {
    r = await _dgraph({ query, mutation, remove, transaction, commitNow, readOnly, discardTxn })
    return r
  } catch (error: any) {
    throw throwDgraph(r, error, { query, mutation, remove, transaction, commitNow, readOnly, bestEffort, discardTxn })
  }
}


function throwDgraph (r: DgraphResponse | undefined, error: any, { query, mutation, remove, transaction, commitNow, readOnly, discardTxn }: DgraphOptions) {
  const errorData = { error, query, mutation, remove, transaction, commitNow, readOnly, discardTxn, r: r ? JSON.stringify(r) : '' }

  if (error?.errors?.length) throw many(error?.errors.map((e: { message: string }) => e.message), errorData)
  else if (error?.message) throw one(error.message, errorData)
  else {
    log(errorData)
    throw errorData
  }
}


export type DgraphOptions = {
  query?: string,
  mutation?: string,
  remove?: string,
  transaction?: DgraphTransaction,
  commitNow?: boolean,
  readOnly?: boolean,
  bestEffort?: boolean,
  discardTxn?: boolean
}
