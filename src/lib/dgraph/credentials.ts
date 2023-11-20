import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import { DGRAPH_CLOUD_URL, DGRAPH_CLOUD_API_KEY, DGRAPH_CLOUD_URL_QA, DGRAPH_CLOUD_API_KEY_QA } from '$env/static/private'


export default function credentials (pointMain?: boolean): { endpoint: string, apiKey: string } {
  return pointMain || PUBLIC_ENVIRONMENT === 'main' ?
    { endpoint: DGRAPH_CLOUD_URL, apiKey: DGRAPH_CLOUD_API_KEY } :
    { endpoint: DGRAPH_CLOUD_URL_QA, apiKey: DGRAPH_CLOUD_API_KEY_QA }
}
