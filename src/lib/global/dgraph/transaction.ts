import { enumContentType } from './enums'
import type { DgraphTransactionConstructor, DgraphMutationOptions, DgraphApiHeaders, DgraphTransactionExtensions, DgraphResponse } from './dgraph.d'


export class DgraphTransaction { // https://dgraph.io/docs/dql/clients/raw-http/
  hash = ''
  startTs = 0
  timeout = 600
  apiKey: string
  isClosed = false
  isAborted = false
  isCommited = false
  endpoint: string
  keys: string[] = []
  preds: string[] = []
  didMutations = false // IF any mutations were done during transactions life
  readOnly = false // readOnly transactions are useful to increase read speed because they can circumvent the usual consensus protocol. Read-only transactions cannot contain mutations
  bestEffort = false // bestEffort flag asks Dgraph Alpha to try to get timestamps from memory on a best-effort basis to reduce the number of outbound requests to Zero. This may yield improved latencies in read-bound workloads where linearizable reads are not strictly needed


  constructor ({ apiKey, endpoint, readOnly, bestEffort, timeout }: DgraphTransactionConstructor) {
    if (!apiKey) throw { id: 'fln__dgraph__missing-apiKey', message: 'Transaction constructor needs an apiKey', log: { apiKey } }
    if (!endpoint) throw { id: 'fln__dgraph__missing-endpoint', message: 'Transaction constructor needs an endpoint', log: { endpoint } }

    this.apiKey = apiKey
    this.endpoint = endpoint

    if (readOnly) this.readOnly = true
    if (timeout) this.timeout = timeout
    if (bestEffort) this.bestEffort = true
  }


  async query (closeWhenDone: boolean, query: string): Promise<DgraphResponse> {
    if (this.isAborted) throw { id: 'fln__dgraph__already-aborted', message: 'Transaction already aborted', log: { query } }
    else if (this.isCommited) throw { id: 'fln__dgraph__already-commited', message: 'Transaction already commited', log: { query } }
    else if (this.isClosed) throw { id: 'fln__dgraph__already-closed', message: 'Transaction already closed', log: { query } }
    else {
      const searchParams = new URLSearchParams()

      if (this.hash) searchParams.set('hash', this.hash)
      if (this.startTs !== 0) searchParams.set('startTs', String(this.startTs))
      if (this.timeout > 0) searchParams.set('timeout', String(this.timeout) + 's')
      if (this.readOnly) searchParams.set('ro', 'true')
      if (this.bestEffort) searchParams.set('be', 'true')

      const searchParamsStr = searchParams.toString()
      const path = searchParamsStr ? `query?${ searchParamsStr }` : 'query'
      const r = await this.#api({ path, body: query, contentType: enumContentType.dql })

      if (closeWhenDone) this.isClosed = true
      else this.#mergeContext(r?.extensions?.txn)

      return r
    } 
  }


  async mutate ({ mutation, remove, commitNow }: DgraphMutationOptions): Promise<DgraphResponse> {
    if (!mutation && !remove) throw { id: 'fln__dgraph__empty-mutate', message: 'Mutate function requires a mutation or remove string' }
    else if (this.isAborted) throw { id: 'fln__dgraph__already-aborted', message: 'Transaction already aborted', log: { mutation, remove, commitNow } }
    else if (this.isCommited) throw { id: 'fln__dgraph__already-commited', message: 'Transaction already commited', log: { mutation, remove, commitNow } }
    else if (this.isClosed) throw { id: 'fln__dgraph__already-closed', message: 'Transaction already closed', log: { mutation, remove, commitNow } }
    else if (this.readOnly) throw { id: 'fln__dgraph__readonly-mutation', message: 'Readonly transactions may not contain mutations', log: { mutation, remove, commitNow } }
    else {
      this.didMutations = true

      const body = mutation ? `{ set { ${ mutation } } }` : `{ delete { ${ remove } } }`

      const searchParams = new URLSearchParams()
      if (commitNow) searchParams.set('commitNow', 'true')
      if (this.hash) searchParams.set('hash', String(this.hash))
      if (this.startTs) searchParams.set('startTs', String(this.startTs))

      const searchParamsStr = searchParams.toString()
      const path = searchParamsStr ? `mutate?${ searchParamsStr }` : 'mutate'
      const r = await this.#api({ path, body, contentType: enumContentType.rdf })

      if (commitNow) this.isCommited = true
      else this.#mergeContext(r?.extensions?.txn)

      return r
    }
  }


  async commit (): Promise<DgraphResponse | void> {
    if (this.isAborted) throw { id: 'fln__dgraph__already-aborted', message: 'Transaction already aborted' }
    else if (this.isCommited) throw { id: 'fln__dgraph__already-commited', message: 'Transaction already commited' }
    else if (this.isClosed) throw { id: 'fln__dgraph__already-closed', message: 'Transaction already closed' }
    else {
      this.isCommited = true

      if (this.didMutations) { // IF transaction did mutations => api call to "/commit" happens
        const body = JSON.stringify(this.keys)

        const searchParams = new URLSearchParams()
        searchParams.set('startTs', String(this.startTs))
        if (this.hash) searchParams.set('hash', this.hash)

        const path = 'commit?' + searchParams.toString()

        return await this.#api({ path, body, contentType: enumContentType.json })
      }
    }
  }


  async abort (): Promise<DgraphResponse | void> {
    if (!this.isAborted) {
      this.isAborted = true

      if (this.didMutations) { // IF transaction did mutations => api call to "/commit?abort=true" happens
        const searchParams = new URLSearchParams()
        searchParams.set('startTs', String(this.startTs))
        searchParams.set('abort', 'true')
        if (this.hash) searchParams.set('hash', this.hash)

        const path = 'commit?' + searchParams.toString()

        return await this.#api({ path })
      }
    }
  }


  async #api ({ path, contentType, body }:  { path: string, contentType?: enumContentType, body?: string }): Promise<DgraphResponse> {
    const headers: DgraphApiHeaders = { 'X-Auth-Token': this.apiKey }
    if (contentType) headers['Content-Type'] = contentType

    const requestInit: RequestInit = { method: 'POST', headers }
    if (body) requestInit.body = body

    const url = this.endpoint +'/'+ path

    try {
      const rFetch = await fetch(url, requestInit)

      if (rFetch.status < 200 || rFetch.status>= 300) throw rFetch
      else return await rFetch.json()
    } catch (e) {
      await this.abort()
      throw e
    }
  }


  #mergeContext(extensions?: DgraphTransactionExtensions) {
    if (extensions) {
      if (extensions.hash) this.hash = extensions.hash

      if (this.startTs === 0) this.startTs = extensions.start_ts 
      else if (this.startTs !== extensions.start_ts) throw { id: 'fln__dgraph__start-ts-mismatch', message: 'The start_ts on the last request does not match the start_ts in the transaction', data: { transactionStartTs: this.startTs, responseStartTs: extensions.start_ts } }

      if (extensions.keys) this.keys = this.#mergeArrays(this.keys, extensions.keys)
      if (extensions.preds) this.preds = this.#mergeArrays(this.preds, extensions.preds)
    }
  }


  #mergeArrays(a: string[], b: string[]) {
    const concat = a.concat(b) // concat arrays
    const set = new Set(concat) // remove duplicates
    return Array.from(set) // convert set to an array
  }
}
