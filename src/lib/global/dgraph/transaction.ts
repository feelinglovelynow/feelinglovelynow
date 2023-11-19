export class DgraphTransaction { // https://dgraph.io/docs/dql/clients/raw-http/
  hash = ''
  start_ts = 0
  timeout = 600
  apiKey: string
  aborted = false
  endpoint: string
  discarded = false
  keys: string[] = []
  preds: string[] = []
  readOnly = false // Read-only transactions are useful to increase read speed because they can circumvent the usual consensus protocol. Read-only transactions cannot contain mutations and trying to call txn.Commit() will result in an error. Calling txn.Discard() will be a no-op.
  bestEffort = false // Using this flag will ask the Dgraph Alpha to try to get timestamps from memory on a best-effort basis to reduce the number of outbound requests to Zero. This may yield improved latencies in read-bound workloads where linearizable reads are not strictly needed.


  constructor ({ endpoint, apiKey, readOnly, bestEffort, timeout }: DgraphTransactionConstructor) {
    this.apiKey = apiKey
    this.endpoint = endpoint

    if (readOnly) this.readOnly = true
    if (timeout) this.timeout = timeout
    if (bestEffort) this.bestEffort = true
  }


  async query (query: string) {
    if (this.discarded) throw { id: 'fln__dgraph__already-discarded', message: 'Transaction already discarded' }
    else {
      const searchParams = new URLSearchParams()

      if (this.hash) searchParams.set('hash', this.hash)
      if (this.start_ts !== 0) searchParams.set('startTs', String(this.start_ts))
      if (this.timeout > 0) searchParams.set('timeout', String(this.timeout) + 's')
      if (this.readOnly) searchParams.set('ro', 'true')
      if (this.bestEffort) searchParams.set('be', 'true')

      const searchParamsStr = searchParams.toString()
      const path = searchParamsStr ? `query?${ searchParamsStr }` : 'query'
      const r = await this.#api({ path, contentType: enumContentType.dql, body: query })
      this.#mergeContext(r?.extensions?.txn)
      return r
    } 
  }


  async mutate ({ mutation, remove, commitNow }: DgraphMutationOptions) {
    if (this.discarded) throw { id: 'fln__dgraph__already-discarded', message: 'Transaction already discarded' }
    else if (!mutation && !remove) throw { id: 'fln__dgraph__empty-mutate', message: 'Mutate function requires a mutation or remove string' }
    else {
      const body = mutation ? `{ set { ${ mutation } } }` : `{ delete { ${ remove } } }`

      const searchParams = new URLSearchParams()
      if (commitNow) searchParams.set('commitNow', 'true')
      if (this.hash) searchParams.set('hash', String(this.hash))
      if (this.start_ts) searchParams.set('startTs', String(this.start_ts))

      const searchParamsStr = searchParams.toString()
      const path = searchParamsStr ? `mutate?${ searchParamsStr }` : 'mutate'
      const r = await this.#api({ path, contentType: enumContentType.rdf, body })

      if (commitNow) this.discarded = true

      this.#mergeContext(r?.extensions?.txn)
      return r
    }
  }


  async discard () {
    if (!this.discarded) {
      this.discarded = true

      const searchParams = new URLSearchParams()
      searchParams.set('startTs', String(this.start_ts))
      searchParams.set('abort', 'true')
      if (this.hash) searchParams.set('hash', this.hash)

      return await this.#api({ path: 'commit?' + searchParams.toString() })
    }
  }


  async commit () {
    if (this.discarded) throw { id: 'fln__dgraph__already-discarded', message: 'Transaction already discarded' }
    else {
      this.discarded = true

      const body = JSON.stringify(this.keys)

      const searchParams = new URLSearchParams()
      searchParams.set('startTs', String(this.start_ts))
      if (this.hash) searchParams.set('hash', this.hash)

      return await this.#api({ body, contentType: enumContentType.json, path: 'commit?' + searchParams.toString() })
    }
  }


  async #api ({ path, contentType, body }:  { path: string, contentType?: enumContentType, body?: string }) {
    const headers: DgraphApiHeaders = { 'X-Auth-Token': this.apiKey }
    if (contentType) headers['Content-Type'] = contentType

    const requestInit: RequestInit = { method: 'POST', headers }
    if (body) requestInit.body = body

    const url = this.endpoint +'/'+ path
    const rFetch = await fetch(url, requestInit)

    if (rFetch.status < 200 || rFetch.status>= 300) throw rFetch
    else return await rFetch.json()
  }


  #mergeContext(extensions?: DgraphTransactionExtensions) {
    if (extensions) {
      if (extensions.hash) this.hash = extensions.hash

      if (this.start_ts === 0) this.start_ts = extensions.start_ts 
      else if (this.start_ts !== extensions.start_ts) throw { id: 'fln__dgraph__start-ts-mismatch', message: 'The start_ts on the last request does not match the start_ts in the transaction', data: { transactionStartTs: this.start_ts, responseStartTs: extensions.start_ts } }

      if (extensions.keys) this.keys = this.#mergeArrays(this.keys, extensions.keys)
      if (extensions.preds) this.preds = this.#mergeArrays(this.preds, extensions.preds)
    }
  }


  #mergeArrays(a: string[], b: string[]) {
    const concat = a.concat(b) // merge arrays
    const set = new Set(concat) // remove duplicates
    return Array.from(set) // convert back to an array
  }
}


enum enumContentType {
  dql = 'application/dql',
  rdf = 'application/rdf',
  json = 'application/json',
}


type DgraphTransactionConstructor = {
  endpoint: string
  apiKey: string
  timeout?: number
  readOnly?: boolean
  bestEffort?: boolean
}


type DgraphTransactionExtensions = {
  start_ts: number
  aborted?: boolean
  keys: string[]
  preds: string[]
  readOnly: boolean
  hash: string
}


type DgraphApiHeaders = {
  'X-Auth-Token': string,
  'Content-Type'?: enumContentType
}


interface DgraphMutationOptionsBasic { commitNow?: boolean } // https://stackoverflow.com/a/61281828
interface DgraphMutationOptionsNotRemove extends DgraphMutationOptionsBasic { mutation: string, remove?: never }
interface DgraphMutationOptionsRemove extends DgraphMutationOptionsBasic { remove: string, mutation?: never }
export type DgraphMutationOptions = DgraphMutationOptionsNotRemove | DgraphMutationOptionsRemove
