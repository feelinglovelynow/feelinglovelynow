import { enumSvelteKVPoint } from './enumSvelteKVPoint'


export type SvelteKVConstructor = {
  apiToken: string,
  accountId: string,
  namespace: string,
  namespaceId: string,
  point: enumSvelteKVPoint,
  doJSONParse: boolean,
  doJSONStringify: boolean,
  platform?: Readonly<App.Platform>
}
