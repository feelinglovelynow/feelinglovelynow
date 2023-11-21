import type { SvelteKVConstructor } from './index.d'
import { enumSvelteKVPoint } from './enumSvelteKVPoint'


export class SvelteKV {
  apiToken: string
  accountId: string
  namespace: string
  namespaceId: string
  doJSONParse: boolean
  doJSONStringify: boolean
  point: enumSvelteKVPoint
  platform?: Readonly<App.Platform>

  constructor ({ apiToken, accountId, namespace, namespaceId, point, doJSONParse, doJSONStringify, platform }: SvelteKVConstructor) {
    this.#constructorValidation({ apiToken, accountId, namespace, namespaceId, point, doJSONParse, doJSONStringify, platform })

    this.point = point
    this.apiToken = apiToken
    this.platform = platform
    this.accountId = accountId
    this.namespace = namespace
    this.namespaceId = namespaceId
    this.doJSONParse = doJSONParse
    this.doJSONStringify = doJSONStringify
  }

  async get (key: string) {
    let value: any

    if (!key) throw { id: 'fln__svelte-kv__missing-key', message: 'Get function needs a key', log: { key } }
    else {
      switch (this.point) {
        case enumSvelteKVPoint.platform:
          if (!this.platform) throw { id: 'fln__svelte-kv__missing-platform', message: 'Get function IF this.point === enumSvelteKVPoint.platform needs this.platform to be defined', log: { platform: this.platform } }
          else {
            value = await this.platform.env[ this.namespace ].get(key)
            if (this.doJSONParse) value = JSON.parse(value) 
          }
          break
        case enumSvelteKVPoint.api:
          const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ this.apiToken }` }
          const rFetch = await fetch(this.getUrl(key), { headers })
          value = await rFetch[ this.doJSONParse ? 'json' : 'text' ]()
          break
      }

      return value
    }
  }


  async put (key: string, value: any, metadata?: string) {
    if (!key) throw { id: 'fln__svelte-kv__missing-key', message: 'Put function needs a key', log: { key } }
    else if (!value) throw { id: 'fln__svelte-kv__missing-value', message: 'Put function needs a value', log: { value } }
    else {
      switch (this.point) {
        case enumSvelteKVPoint.platform:
          if (!this.platform) throw { id: 'fln__svelte-kv__missing-platform', message: 'Put function IF this.point === enumSvelteKVPoint.platform needs this.platform to be defined', log: { platform: this.platform } }
          else await this.platform.env[ this.namespace ].put(key, this.doJSONStringify ? JSON.stringify(value) : value)
          break
        case enumSvelteKVPoint.api:
          const headers = { 'Authorization': `Bearer ${ this.apiToken }` }
          const formData  = new FormData()
          formData.append('value', this.doJSONStringify ? JSON.stringify(value) : value)
          formData.append('metadata', metadata || JSON.stringify({}))
          await fetch(this.getUrl(key), { method: 'PUT', body: formData, headers })
          break
      }
    }
  }


  getUrl (key: string) {
    return `https://api.cloudflare.com/client/v4/accounts/${ this.accountId }/storage/kv/namespaces/${ this.namespaceId }/values/${ key }`
  }


  #constructorValidation ({ apiToken, accountId, namespace, namespaceId, point, doJSONParse, doJSONStringify, platform }: SvelteKVConstructor) {
    if (!apiToken) throw { id: 'fln__svelte-kv__missing-apiToken', message: 'SvelteKV constructor needs a apiToken', log: { apiToken } }
    if (!accountId) throw { id: 'fln__svelte-kv__missing-accountId', message: 'SvelteKV constructor needs a accountId', log: { platform } }
    if (!namespace) throw { id: 'fln__svelte-kv__missing-namespace', message: 'SvelteKV constructor needs a namespace', log: { namespace } }
    if (!namespaceId) throw { id: 'fln__svelte-kv__missing-namespaceId', message: 'SvelteKV constructor needs a namespaceId', log: { namespaceId } }
    if (typeof doJSONParse !== 'boolean') throw { id: 'fln__svelte-kv__missing-doJSONParse', message: 'SvelteKV constructor needs a doJSONParse', log: { doJSONParse } }
    if (typeof doJSONStringify !== 'boolean') throw { id: 'fln__svelte-kv__missing-doJSONStringify', message: 'SvelteKV constructor needs a doJSONStringify', log: { doJSONStringify } }
    if (!point) throw { id: 'fln__svelte-kv__missing-point', message: 'SvelteKV constructor needs a point', log: { point } }
    if (point === enumSvelteKVPoint.platform && !platform) throw { id: 'fln__svelte-kv__missing-platform', message: 'SvelteKV constructor needs a IF this.point === enumSvelteKVPoint.platform', log: { point, platform } }
  }
}
