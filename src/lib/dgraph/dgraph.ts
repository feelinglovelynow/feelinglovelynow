import dgraphJsHttp from 'dgraph-js-http'
import { log, many } from '$lib/catch/error'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import type { DgraphOptions, DgraphResponse, DgraphTransaction } from '$lib'
import { DGRAPH_CLOUD_URL, DGRAPH_CLOUD_API_KEY, DGRAPH_CLOUD_URL_QA, DGRAPH_CLOUD_API_KEY_QA } from '$env/static/private'


export function txn ({ readOnly, pointMain }: { readOnly?: boolean, pointMain?: boolean }): DgraphTransaction {
  const params = pointMain || PUBLIC_ENVIRONMENT === 'main' ?
    { url: DGRAPH_CLOUD_URL, apiKey: DGRAPH_CLOUD_API_KEY } :
    { url: DGRAPH_CLOUD_URL_QA, apiKey: DGRAPH_CLOUD_API_KEY_QA }

  const clientStub = new dgraphJsHttp.DgraphClientStub(params.url)
  const dgraphClient = new dgraphJsHttp.DgraphClient(clientStub)

  dgraphClient.setCloudApiKey(params.apiKey)
  return dgraphClient.newTxn(readOnly ? { readOnly: true, bestEffort: true } : {})
}


export async function dgraph ({ query, mutation, remove, transaction, commitNow, readOnly, discardTxn }: DgraphOptions): Promise<DgraphResponse> {
  transaction = transaction ? transaction : txn({ readOnly })

  try {
    let r

    if (query) r = await transaction.query(query) as DgraphResponse
    else if (mutation) {
      if (commitNow) r = await transaction.mutate({ setNquads: mutation, commitNow: commitNow }) as DgraphResponse
      else r = await transaction.mutate({ setNquads: mutation }) as DgraphResponse
    } else {
      if (commitNow) r = await transaction.mutate({ deleteNquads: remove, commitNow: commitNow }) as DgraphResponse
      else r = await transaction.mutate({ deleteNquads: remove }) as DgraphResponse
    }

    if (r?.errors?.length) throw many(r?.errors.map((e: { message: string  }) => e.message), { query, mutation, remove, transaction, commitNow, readOnly, r: JSON.stringify(r) })

    if (discardTxn) await transaction.discard()
    else if (commitNow) {
      if (query) await transaction.commit()
      await transaction.discard()
    }

    return r
  } catch (error) {
    log({ error, query, mutation, remove, transaction, commitNow, readOnly, discardTxn })
    await transaction.discard()
    throw error
  }
}
