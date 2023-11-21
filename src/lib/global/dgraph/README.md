# 🕉 @feelinglovelynow/dgraph


## 💎 Install
```bash
pnpm add @feelinglovelynow/dgraph
```


## 🙏 Description
* B/c the npm package [dgraph-js-http](https://www.npmjs.com/package/dgraph-js-http?activeTab=dependencies) has a dependency on `jsonwebtoken` it does not work on the edge
*  `@feelinglovelynow/dgraph` has 0 dependencies and works on the edge
* Features a `DgraphTransaction` class that ceates a transaction object with lots of features to ease workflow with [dgraph cloud instances](https://dgraph.io/product). Guidance came from [here](https://dgraph.io/docs/dql/clients/raw-http/).


## 💚 Dgraph Transaction Constructor
```ts
constructor ({ apiKey, endpoint, readOnly, bestEffort, timeout })
```
* **REQUIRED**: `apiKey { string }`: Found @ Dgraph Cloud > Settings > Api Keys
* **REQUIRED**: `endpoint { string }`: Found @ Dgraph Cloud > GraphQL Endpoint. **Remove /graphql from endpoint b4 sending to this constructor**
* **Default is false**: `readOnly { boolean }`: Read only transactions are useful to increase read speed because they can circumvent the usual consensus protocol. Read-only transactions cannot contain mutations.
* **Default is false**: `bestEffort { boolean }`: This Best Effort flag asks Dgraph Alpha to try to get timestamps from memory on a best-effort basis to reduce the number of outbound requests to Zero. This may yield improved latencies in read-bound workloads where linearizable reads are not strictly needed.
* **Default is 600**: `timeout { number }:` Max seconds any query of this transaction will be allowed to be attempted


## 💛 transaction.query(closeWhenDone: boolean, query: string): Promise\<DgraphResponse\>
* Sends a query to a dgraph cloud instance
* Only accepts `DQL` syntax
* IF `closeWhenDone` is set to true the transaction will not be allowed to be used again (does not send a request to dgraph cloud instance, just tips `this.isClosed` flag)
```ts
async function getProducts (): Promise<Product[]> {
  const transaction = new DgraphTransaction({ ...txnOptions(), readOnly: true, bestEffort: true })

  const r = await transaction.query(true, `
    query {
      products(func: type(Product)) {
        uid
        name: Product.name
      }
    }
  `)

  return r?.data?.products as Product[]
}
```


## 🧡 TYPE: DgraphResponse
```ts
export type DgraphResponse = DgraphSuccessResponse | DgraphErrorResponse
interface DgraphResponseInterface {} // https://stackoverflow.com/a/61281828
interface DgraphSuccessResponse extends DgraphResponseInterface  { data: any, extensions: any, txn: any, metrics: never, name: never, url: never, errors: never }
interface DgraphErrorResponse extends DgraphResponseInterface { name: string, url: string, errors: { message: string, extensions: { code: string } }[], data: never, errors?: never, extensions: never, txn: never, metrics: never }

```


## ❤️ transaction.mutate({ mutation, remove, commitNow }: DgraphMutationOptions): Promise\<DgraphResponse\>
* Sends a mutation to a dgraph cloud instance
* Only accepts `rdf` triples syntax
* If `commitNow` is true we tell dgraph in this mutation api call that this is the last query or mutation coming from this transation
```ts
const t1 = new DgraphTransaction({ ...txnOptions() })

await t1.mutate({ // remove + commit t1
  commitNow: true,
  remove: `<${ uid }> * * .`
})

const t2 = new DgraphTransaction({ ...txnOptions() })

await t2.mutate({ // mutation
  mutation: `
    <${ uid2 }> <Abc.xyz> "${ abc }" .
    <${ uid3 }> <Abc.xyz> "${ abc }" .
    <${ uid4 }> <Abc.xyz> "${ abc }" .
  `
})

await t2.mutate({ remove: `<${ uid5 }> * * .` }) // remove

await t2.commit() // commit t2
```

## 💟 TYPE: DgraphMutationOptions
```ts
export type DgraphMutationOptions = DgraphMutationOptionsNotRemove | DgraphMutationOptionsRemove
interface DgraphMutationOptionsBasic { commitNow?: boolean } // https://stackoverflow.com/a/61281828
interface DgraphMutationOptionsNotRemove extends DgraphMutationOptionsBasic { mutation: string, remove?: never }
interface DgraphMutationOptionsRemove extends DgraphMutationOptionsBasic { remove: string, mutation?: never }
```

## 🌟 transaction.abort(): Promise\<DgraphResponse | void\>
* IF transaction has done any mutations => send an api call to dgraph cloud to let it know no more incoming actions will be coming from this transaction and to `rollback` all that has been done by this transaction
* IF transaction has done no mutations => set `this.aborted` to true so no further queries or mutations may happen with transaction


## ✨ transaction.commit(): Promise\<DgraphResponse | void\>
* IF transaction has done any mutations => send an api call to dgraph cloud to let it know no more incoming actions will be coming from this transaction and to `commit` all that has been done by this transaction
* IF transaction has done no mutations => set `this.aborted` to true so no further queries or mutations may happen with transaction

## 👍 Errors we may throw
* `constructor()`
```ts
if (!apiKey) throw { id: 'fln__dgraph__missing-apiKey', message: 'Transaction constructor needs an apiKey', log: { apiKey } }
if (!endpoint) throw { id: 'fln__dgraph__missing-endpoint', message: 'Transaction constructor needs an endpoint', log: { endpoint } }
```
* `this.query()`
```ts
if (this.isAborted) throw { id: 'fln__dgraph__already-aborted', message: 'Transaction already aborted', log: { query } }
else if (this.isCommited) throw { id: 'fln__dgraph__already-commited', message: 'Transaction already commited', log: { query } }
else if (this.isClosed) throw { id: 'fln__dgraph__already-closed', message: 'Transaction already closed', log: { query } }
```
* `this.mutate()`
```ts
if (!mutation && !remove) throw { id: 'fln__dgraph__empty-mutate', message: 'Mutate function requires a mutation or remove string' }
else if (this.isAborted) throw { id: 'fln__dgraph__already-aborted', message: 'Transaction already aborted', log: { mutation, remove, commitNow } }
else if (this.isCommited) throw { id: 'fln__dgraph__already-commited', message: 'Transaction already commited', log: { mutation, remove, commitNow } }
else if (this.isClosed) throw { id: 'fln__dgraph__already-closed', message: 'Transaction already closed', log: { mutation, remove, commitNow } }
else if (this.readOnly) throw { id: 'fln__dgraph__readonly-mutation', message: 'Readonly transactions may not contain mutations', log: { mutation, remove, commitNow } }
```
* `this.commit()`
```ts
if (this.isAborted) throw { id: 'fln__dgraph__already-aborted', message: 'Transaction already aborted' }
else if (this.isCommited) throw { id: 'fln__dgraph__already-commited', message: 'Transaction already commited' }
else if (this.isClosed) throw { id: 'fln__dgraph__already-closed', message: 'Transaction already closed' }
```
* `this.query()` |  `this.mutate()` |  `this.abort()` |  `this.commit()`
```ts
try {
  const rFetch = await fetch(url, requestInit)

  if (rFetch.status < 200 || rFetch.status>= 300) throw rFetch
  else return await rFetch.json()
} catch (e) {
  await this.abort()
  throw e
}
```
## 🎁 All Our Packages
1. @feelinglovelynow/dgraph: [NPM](https://www.npmjs.com/package/@feelinglovelynow/dgraph) ⋅ [Github](https://github.com/feelinglovelynow/dgraph)
1. @feelinglovelynow/env-write: [NPM](https://www.npmjs.com/package/@feelinglovelynow/env-write) ⋅ [Github](https://github.com/feelinglovelynow/env-write)
1. @feelinglovelynow/get-form-entries: [NPM](https://www.npmjs.com/package/@feelinglovelynow/get-form-entries) ⋅ [Github](https://github.com/feelinglovelynow/get-form-entries)
1. @feelinglovelynow/get-relative-time: [NPM](https://www.npmjs.com/package/@feelinglovelynow/get-relative-time) ⋅ [Github](https://github.com/feelinglovelynow/get-relative-time)
1. @feelinglovelynow/global-style: [NPM](https://www.npmjs.com/package/@feelinglovelynow/global-style) ⋅ [Github](https://github.com/feelinglovelynow/global-style)
1. @feelinglovelynow/jwt: [NPM](https://www.npmjs.com/package/@feelinglovelynow/jwt) ⋅ [Github](https://github.com/feelinglovelynow/jwt)
1. @feelinglovelynow/loop-backwards: [NPM](https://www.npmjs.com/package/@feelinglovelynow/loop-backward) ⋅ [Github](https://github.com/feelinglovelynow/loop-backwards)
1. @feelinglovelynow/slug: [NPM](https://www.npmjs.com/package/@feelinglovelynow/slug) ⋅ [Github](https://github.com/feelinglovelynow/slug)
1. @feelinglovelynow/svelte-loading-anchor: [NPM](https://www.npmjs.com/package/@feelinglovelynow/svelte-loading-anchor) ⋅ [Github](https://github.com/feelinglovelynow/svelte-loading-anchor)
1. @feelinglovelynow/svelte-modal: [NPM](https://www.npmjs.com/package/@feelinglovelynow/svelte-modal) ⋅ [Github](https://github.com/feelinglovelynow/svelte-modal)
1. @feelinglovelynow/svelte-turnstile: [NPM](https://www.npmjs.com/package/@feelinglovelynow/svelte-turnstile) ⋅ [Github](https://github.com/feelinglovelynow/svelte-turnstile)
1. @feelinglovelynow/toast: [NPM](https://www.npmjs.com/package/@feelinglovelynow/toast) ⋅ [Github](https://github.com/feelinglovelynow/toast)
