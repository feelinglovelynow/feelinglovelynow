import { dgraph } from '$lib/dgraph/dgraph'
import type { SchemaAddSiteComment } from '$lib/zod/addSiteComent'


export default async function addSiteComment (body: SchemaAddSiteComment) {
  return dgraph({ commitNow: true, mutation: `
    _:comment <dgraph.type> "SiteComment" .
    _:comment <SiteComment.email> "${ body.email }" .
    _:comment <SiteComment.firstName> "${ body.firstName }" .
    _:comment <SiteComment.lastName> "${ body.lastName }" .
    _:comment <SiteComment.createdAt> "${ (new Date()).toISOString() }" .
    _:comment <SiteComment.comment> "${ body.comment }" .
  `})
}
