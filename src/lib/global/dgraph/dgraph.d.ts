import type { DgraphTransaction } from './transaction'


export type DgraphFunctionOptions = {
  transaction: DgraphTransaction,
  query?: string,
  mutation?: string,
  remove?: string,
  commitNow?: boolean,
  readOnly?: boolean,
  discardTxn?: boolean
}


export type DgraphTransactionConstructor = {
  apiKey: string
  endpoint: string
  readOnly?: boolean
  bestEffort?: boolean
  timeout?: number
}


export type DgraphTransactionExtensions = {
  start_ts: number
  aborted?: boolean
  keys: string[]
  preds: string[]
  readOnly: boolean
  hash: string
}


export type DgraphApiHeaders = {
  'X-Auth-Token': string,
  'Content-Type'?: enumContentType
} 


export type DgraphMutationOptions = DgraphMutationOptionsNotRemove | DgraphMutationOptionsRemove
interface DgraphMutationOptionsBasic { commitNow?: boolean } // https://stackoverflow.com/a/61281828
interface DgraphMutationOptionsNotRemove extends DgraphMutationOptionsBasic { mutation: string, remove?: never }
interface DgraphMutationOptionsRemove extends DgraphMutationOptionsBasic { remove: string, mutation?: never }


export type DgraphResponse = DgraphSuccessResponse | DgraphErrorResponse
interface DgraphResponseInterface {} // https://stackoverflow.com/a/61281828
interface DgraphSuccessResponse extends DgraphResponseInterface  { data: any, extensions: any, txn: any, metrics: never, name: never, url: never, errors: never }
interface DgraphErrorResponse extends DgraphResponseInterface { name: string, url: string, errors: { message: string, extensions: { code: string } }[], data: never, errors?: never, extensions: never, txn: never, metrics: never }
