import type { DgraphTransaction } from './transaction'


interface DgraphResponseInterface {} // https://stackoverflow.com/a/61281828
interface DgraphSuccessResponse extends DgraphResponseInterface  { data: any, errors?: never }
interface DgraphErrorResponse extends DgraphResponseInterface { data?: never, errors: { message: string }[] }
export type DgraphResponse = DgraphSuccessResponse | DgraphErrorResponse


export type DgraphOptions = {
  transaction: DgraphTransaction,
  query?: string,
  mutation?: string,
  remove?: string,
  commitNow?: boolean,
  readOnly?: boolean,
  discardTxn?: boolean
}
