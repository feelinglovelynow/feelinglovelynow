import type { DgraphOptions, DgraphResponse } from './dgraph.d'


export async function dgraph ({ transaction, query, mutation, remove, commitNow, discardTxn }: DgraphOptions): Promise<DgraphResponse> {
  try {
    let r

    if (query) r = await transaction.query(query) as DgraphResponse
    else if (mutation) r = await transaction.mutate({ mutation, commitNow }) as DgraphResponse
    else if (remove) r = await transaction.mutate({ remove, commitNow }) as DgraphResponse
    else throw { id: 'fln__dgraph__action-missing', message: 'Send dgraph function a query mutation or remove string please' }

    if (r?.errors?.length) throw r.errors

    if (discardTxn) await transaction.discard()
    else if (commitNow) {
      if (query) await transaction.commit()
      await transaction.discard()
    }

    return r
  } catch (error) {
    await transaction.discard()
    throw error
  }
}
